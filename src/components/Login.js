import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const schema = yup
  .object({
    username: yup.string().required("Bu alanın doldurulması zorunludur."),
    password: yup.string().required("Bu alanın doldurulması zorunludur."),
  })
  .required();

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);
  const [isInvalid, setIsInvalid] = useState(false);

  console.log(isInvalid);

  useEffect(() => {
    setIsInvalid(false);
  }, [watch("username")]);

  const onSubmit = (data) => {
    console.log(data);

    signInWithEmailAndPassword(auth, data.username, data.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        setCurrentUser(user);
        navigate("/admin/basvuru-listesi");
        // ...
      })
      .catch((error) => {
        console.log(error);
        setIsInvalid(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  return (
    <section className="min-h-screen flex flex-col align-middle justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col m-8  p-8 gap-4 rounded-xl  bg-white shadow-xl  "
      >
        <h1 className="pt-8 pb-8  font-bold text-xl">Admin Girişi</h1>
        <div className="flex flex-col gap-4 ">
          <label className="flex  font-bold gap-2 max-w-full ">
            Kullanıcı Adı:
            <input
              {...register("username", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl w-full "
            />
          </label>
          <p className=" text-red-500">{errors.username?.message}</p>
          <label className="flex justify-between font-bold items-center">
            Şifre:
            <input
              type="password"
              defaultValue="test"
              {...register("password", { required: true })}
              className="font-normal p-2 bg-gray-100 rounded-xl"
            />
          </label>
          <p className=" text-red-500">{errors.password?.message}</p>
        </div>

        {errors.exampleRequired && <span>This field is required</span>}

        <input
          className="p-2 text-white bg-sky-600 font-bold rounded-xl"
          type="submit"
        />
        {isInvalid && (
          <div className=" bg-rose-100 border-red-400 border p-2 text-center ">
            Kullanıcı adı veya şifre hatalı!
          </div>
        )}
      </form>
    </section>
  );
}

export default Login;
