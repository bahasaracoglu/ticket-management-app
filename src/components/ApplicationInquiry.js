import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const schema = yup
  .object({
    applicationNo: yup.string().required("Bu alanın doldurulması zorunludur."),
  })
  .required();

function ApplicationInquiry() {
  const [isInvalid, setIsInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    setIsInvalid(false);
  }, [watch("applicationNo")]);
  const navigate = useNavigate();

  const checkApplication = async (data) => {
    try {
      setLoading(true);
      const docRef = doc(db, "applications", data.applicationNo);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        navigate(`/basvuru/${data.applicationNo}`);
      } else {
        console.log("No such document!");
        setIsInvalid(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    console.log(data);
  };

  const onSubmit = (data) => {
    checkApplication(data);
  };

  return (
    <section className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col my-6 w-5/6 p-8 gap-4 rounded-xl max-w-screen-md bg-white shadow-xl"
      >
        <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Sorgula</h1>
        <div className="flex flex-col gap-4  ">
          <label className="flex flex-col justify-between font-bold gap-2">
            Başvuru No:
            <input
              defaultValue="123456"
              {...register("applicationNo", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl outline-blue-400 w-full"
            />
          </label>
        </div>
        {errors.exampleRequired && <span>This field is required</span>}
        <div className="flex flex-col gap-2 h-24 justify-center">
          {/* Yüklenme durumuna göre button rengini ve içeriğini değiştir */}
          <button
            className={`p-2 text-white font-bold rounded-xl ${
              loading ? "bg-gray-500" : "bg-sky-600"
            }`}
            type="submit"
            disabled={loading} // Yüklenme durumundayken butonu devre dışı bırak
          >
            {loading ? "Yükleniyor..." : "Gönder"}
          </button>
          {isInvalid && (
            <div className=" bg-rose-100 border-red-400 border p-2 text-center ">
              Hatalı başvuru numarası!
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

export default ApplicationInquiry;
