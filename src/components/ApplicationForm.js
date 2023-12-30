import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    firstName: yup.string().required("Bu alanın doldurulması zorunludur."),
    lastName: yup.string().required("Bu alanın doldurulması zorunludur."),
    age: yup
      .number()
      .positive()
      .integer()
      .required("Bu alanın doldurulması zorunludur."),
    tcNo: yup
      .number()
      .positive()
      .integer()
      .required("Bu alanın doldurulması zorunludur."),
    purposeOfApp: yup.string().required("Bu alanın doldurulması zorunludur."),
    address: yup.string().required("Bu alanın doldurulması zorunludur."),
    additionalFile: yup.mixed().required("File is required"),
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
            console.log(typeof downloadURL);
            console.log("File available at", downloadURL);
            console.log(downloadURL);
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
        className="flex flex-col my-6 w-5/6  p-8 gap-4 rounded-xl bg-white shadow-xl lg:w-3/6 "
      >
        <h1 className="pt-8 pb-8  font-bold text-xl  rounded-xl text-center">
          Application Form
        </h1>
        <div className="flex flex-col gap-4  ">
          <label className="flex justify-between font-bold gap-2">
            <span className=" self-center">Ad:</span>
            <input
              defaultValue="test"
              {...register("firstName", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl outline-blue-400 w-full"
            />
          </label>
          <p className=" text-red-500">{errors.firstName?.message}</p>
          <label className="flex justify-between font-bold gap-2">
            <span className=" self-center">Soyad:</span>
            <input
              defaultValue="test"
              {...register("lastName", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl  outline-blue-400 w-full"
            />
          </label>
          <p className=" text-red-500">{errors.lastName?.message}</p>
          <label className="flex justify-between font-bold gap-2">
            <span className=" self-center">Yaş:</span>
            <input
              defaultValue="28"
              {...register("age", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl  outline-blue-400 w-full"
            />
          </label>
          <p className=" text-red-500">{errors.age?.message}</p>
          <label className="flex justify-between font-bold gap-2">
            <span className="flex self-center whitespace-nowrap">T.C. No:</span>
            <input
              defaultValue="test"
              {...register("tcNo", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
            />
          </label>
          <p className=" text-red-500">{errors.tcNo?.message}</p>
          <label className="font-bold flex flex-col  gap-2">
            <span>Başvuru Nedeni:</span>
            <input
              defaultValue="test"
              {...register("purposeOfApp", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
            />
          </label>
          <label className="font-bold flex flex-col  gap-2">
            Adres Bilgisi:
            <input
              defaultValue="test"
              {...register("address", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
            />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-bold flex flex-col gap-2">
            Fotograflar/Ekler:
            <input
              type="file"
              id="myFile"
              name="filename"
              {...register("additionalFile", { required: false })}
              className="font-normal"
            />
          </label>
        </div>

        {errors.exampleRequired && <span>This field is required</span>}

        <input
          className="p-2 text-white bg-sky-600 font-bold rounded-xl"
          type="submit"
        />
      </form>
    </section>
  );
}

export default ApplicationForm;
