import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    firstName: yup.string().required("Geçerli bir değer giriniz."),
    lastName: yup.string().required("Geçerli bir değer giriniz."),
    age: yup
      .number()
      .positive()
      .integer()
      .required("Geçerli bir değer giriniz.")
      .typeError("Geçerli bir değer giriniz."),
    tcNo: yup
      .number()
      .positive()
      .typeError("Geçerli bir değer giriniz.")
      .min(10000000000, "11 haneli T.C. No giriniz.")
      .integer()
      .required("Geçerli bir değer giriniz."),
    purposeOfApp: yup.string().required("Bu alan zorunludur."),
    address: yup.string().required("Bu alan zorunludur."),
    additionalFile: yup.mixed(),
  })
  .required();

function ApplicationForm({ setApplicationInfo }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      let docData = {};
      if (data.additionalFile[0]) {
        const fileName = new Date().getTime() + data.additionalFile[0].name;
        const fileRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(fileRef, "files");

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
            }
          },
          (error) => {
            console.error("Error during upload:", error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at", downloadURL);
              docData = {
                ...data,
                additionalFile: downloadURL,
                createdAt: Timestamp.now(),
                status: "Çözülmedi",
                response: "",
              };

              const res = await addDoc(collection(db, "applications"), docData);

              console.log(res.id);

              console.log("downloaded", docData);

              setApplicationInfo({ ...docData, id: res.id });

              navigate("/basvuru-basarili");
            } catch (error) {
              console.error("Error getting download URL:", error);
            }
          }
        );
      } else {
        // Dosya seçilmediyse, sadece docData'ya boş bir additionalFile ekleyin
        docData = {
          ...data,
          additionalFile: "", // veya null olarak ayarlayabilirsiniz
          createdAt: Timestamp.now(),
          status: "Çözülmedi",
          response: "",
        };

        const res = await addDoc(collection(db, "applications"), docData);

        console.log(res.id);

        console.log("downloaded", docData);

        setApplicationInfo({ ...docData, id: res.id });

        navigate("/basvuru-basarili");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //console.log(watch("firstName")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <section className="min-h-screen flex  justify-center   ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col my-6  w-5/6  p-8 gap-4 rounded-xl max-w-screen-md bg-white shadow-xl  "
      >
        <h1 className="pt-8 pb-8  font-bold text-xl  rounded-xl text-center">
          Başvuru Formu
        </h1>
        <div className="flex flex-col gap-2  ">
          <div className="flex flex-col gap-2">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">İsim</span>
              <input
                defaultValue="test"
                {...register("firstName", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl outline-blue-400 w-full shadow-sm"
              />{" "}
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.firstName?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Soyisim</span>
              <input
                defaultValue="test"
                {...register("lastName", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl  outline-blue-400 w-full"
              />
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.lastName?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Yaş</span>
              <input
                defaultValue="28"
                {...register("age", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl  outline-blue-400 w-full"
              />
            </label>{" "}
            <p className=" text-sm text-red-500 min-h-6">
              {errors.age?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">T.C. Kimlik Numarası</span>
              <input
                defaultValue="13246545654"
                {...register("tcNo", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
              />
            </label>{" "}
            <p className=" text-sm text-red-500 min-h-6">
              {errors.tcNo?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Başvuru Nedeni</span>
              <input
                defaultValue="test"
                {...register("purposeOfApp", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
              />
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.purposeOfApp?.message}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Adres Bilgisi</span>
              <input
                defaultValue="test"
                {...register("address", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
              />
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.address?.message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex flex-col justify-between font-bold gap-2">
            <span className=" font-medium ">Fotoğraflar/Ekler</span>
            <input
              type="file"
              id="myFile"
              name="filename"
              {...register("additionalFile", { required: false })}
              className="font-normal"
            />
          </label>
          <p className=" text-sm text-red-500 min-h-6">
            {errors.additionalFile?.message}
          </p>
        </div>

        <input
          className="p-2 text-white bg-sky-600 font-bold rounded-xl"
          type="submit"
        />
      </form>
    </section>
  );
}

export default ApplicationForm;
