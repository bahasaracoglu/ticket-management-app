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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-8 gap-4 "
    >
      <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Sorgula</h1>
      <div className="flex flex-col gap-4  ">
        <label className="flex justify-between font-bold">
          Başvuru No:
          <input
            defaultValue="123456"
            {...register("applicationNo", { required: true })}
            className="font-normal"
          />
        </label>
      </div>

      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}

export default ApplicationInquiry;
