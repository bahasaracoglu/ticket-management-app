import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
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
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

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
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-8 gap-4 "
    >
      <h1 className="pt-8 pb-8 font-bold text-xl">Login Form</h1>
      <div className="flex flex-col gap-4  ">
        <label className="flex justify-between font-bold">
          Kullanıcı Adı:
          <input
            defaultValue="test"
            {...register("username", { required: true })}
            className="font-normal"
          />
        </label>{" "}
        <p className=" text-red-500">{errors.username?.message}</p>
        <label className="flex justify-between font-bold">
          Şifre:
          <input
            type="password"
            defaultValue="test"
            {...register("password", { required: true })}
            className="font-normal"
          />
        </label>
        <p className=" text-red-500">{errors.password?.message}</p>
      </div>

      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}

export default Login;
