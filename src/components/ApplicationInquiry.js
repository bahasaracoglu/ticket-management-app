import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    applicationNo: yup.string().required("Bu alanın doldurulması zorunludur."),
  })
  .required();

function ApplicationInquiry() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    navigate(`/basvuru/${data.applicationNo}`);
    console.log(data);
  };
  return (
    <section className="min-h-screen flex  justify-center items-center   ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col my-6 w-5/6 p-8 gap-4 rounded-xl bg-white shadow-xl lg:w-3/6 "
      >
        <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Sorgula</h1>
        <div className="flex flex-col gap-4  ">
          <label className="flex justify-between font-bold gap-2">
            Başvuru No:
            <input
              defaultValue="123456"
              {...register("applicationNo", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl outline-blue-400 w-full"
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

export default ApplicationInquiry;
