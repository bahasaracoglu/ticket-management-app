import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
      .max(99999999999, "11 haneli T.C. No giriniz.")
      .integer()
      .required("Geçerli bir değer giriniz."),
    purposeOfApp: yup.string().required("Bu alan zorunludur."),
    address: yup.string().required("Bu alan zorunludur."),
    additionalFile: yup.mixed(),
  })
  .required();

function ApplicationForm({ setApplicationInfo }) {
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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
            // console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                // console.log("Upload is paused");
                break;
              case "running":
                // console.log("Upload is running");
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
                status: "Bekliyor",
                response: "",
              };
              const res = await addDoc(
                collection(db, "applicationspatika"),
                docData
              );
              // console.log(res.id);
              // console.log("downloaded", docData);
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
          status: "Bekliyor",
          response: "",
        };
        const res = await addDoc(collection(db, "applicationspatika"), docData);
        // console.log(res.id);
        // console.log("downloaded", docData);
        setApplicationInfo({ ...docData, id: res.id });
        navigate("/basvuru-basarili");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //console.log(watch("firstName")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <section className="min-h-screen flex  justify-center items-center  ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col my-6 w-[93%] p-8 gap-4 rounded-xl max-w-screen-md bg-white shadow-xl  "
      >
        <h1 className="pt-8 pb-8  font-bold text-2xl rounded-xl ">
          Başvuru Formu
        </h1>
        <div className="flex flex-col gap-2 md:flex-row flex-wrap justify-between ">
          <div className="flex flex-col gap-2 md:w-[45%]  ">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">İsim</span>
              <input
                placeholder="İsim"
                {...register("firstName", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl outline-blue-400 w-full shadow-sm"
              />{" "}
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.firstName?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:w-[45%] ">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Soyisim</span>
              <input
                placeholder="Soyisim"
                {...register("lastName", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl  outline-blue-400 w-full"
              />
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.lastName?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:w-[45%]">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Yaş</span>
              <input
                placeholder="Yaş"
                {...register("age", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl  outline-blue-400 w-full"
              />
            </label>{" "}
            <p className=" text-sm text-red-500 min-h-6">
              {errors.age?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:w-[45%]">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">T.C. Kimlik Numarası</span>
              <input
                placeholder="T.C. Kimlik Numarası"
                {...register("tcNo", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
              />
            </label>{" "}
            <p className=" text-sm text-red-500 min-h-6">
              {errors.tcNo?.message}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:w-[45%]">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Başvuru Nedeni</span>
              <input
                placeholder="Başvuru Nedeni"
                {...register("purposeOfApp", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
              />
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.purposeOfApp?.message}
            </p>
          </div>
          <div className="flex flex-col gap-2 md:w-[45%]">
            <label className="flex flex-col justify-between font-bold gap-2">
              <span className=" font-medium ">Adres Bilgisi</span>
              <input
                placeholder="Adres Bilgisi"
                {...register("address", { required: true })}
                className="font-normal p-2 bg-gray-100 rounded-xl w-full  outline-blue-400"
              />
            </label>
            <p className=" text-sm text-red-500 min-h-6">
              {errors.address?.message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 ">
          <label className="flex flex-col justify-between font-bold gap-2">
            <span className=" font-medium ">Fotoğraflar/Ekler</span>
            <input
              type="file"
              id="myFile"
              name="filename"
              {...register("additionalFile", { required: false })}
              className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100
               overflow-ellipsis
            "
            />
          </label>
          <p className=" text-sm text-red-500 min-h-6">
            {errors.additionalFile?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            className={`p-2 text-white font-bold rounded-xl ${
              loading ? "bg-gray-500" : "bg-sky-600"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Yükleniyor..." : "Gönder"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ApplicationForm;
