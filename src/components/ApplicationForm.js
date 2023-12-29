import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
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
            };

            const res = await addDoc(collection(db, "applications"), docData);

            console.log(res.id);

            console.log("downloaded", docData);

            setApplicationInfo({ ...docData, id: res.id });

            navigate("/basvuru-basarili");

            // Now that the download URL is available, resolve the promise
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-8 gap-4 "
    >
      <h1 className="pt-8 pb-8 font-bold text-xl">Application Form</h1>
      <div className="flex flex-col gap-4  ">
        <label className="flex justify-between font-bold">
          Ad:
          <input
            defaultValue="test"
            {...register("firstName", { required: true })}
            className="font-normal"
          />
        </label>{" "}
        <p className=" text-red-500">{errors.firstName?.message}</p>
        <label className="flex justify-between font-bold">
          Soyad:
          <input
            defaultValue="test"
            {...register("lastName", { required: true })}
            className="font-normal"
          />
        </label>{" "}
        <p className=" text-red-500">{errors.lastName?.message}</p>
      </div>
      <div className="flex flex-col gap-4  ">
        <label className="flex justify-between font-bold">
          Yaş:
          <input
            defaultValue="28"
            {...register("age", { required: true })}
            className="font-normal"
          />
        </label>

        <label className="flex flex-col justify-between font-bold">
          T.C. Kimlik No:
          <input
            defaultValue="test"
            {...register("tcNo", { required: true })}
            className="font-normal"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <label className="font-bold flex flex-col ">
          Başvuru Nedeni:
          <input
            defaultValue="test"
            {...register("purposeOfApp", { required: true })}
            className="font-normal"
          />
        </label>
        <label className="font-bold flex flex-col">
          Adres Bilgisi:
          <input
            defaultValue="test"
            {...register("address", { required: true })}
            className="font-normal"
          />
        </label>
      </div>
      <div className="flex flex-col gap-4">
        <label className="font-bold flex flex-col">
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

      <input type="submit" />
    </form>
  );
}

export default ApplicationForm;
