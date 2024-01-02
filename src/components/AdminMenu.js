import { getAuth, signOut } from "firebase/auth";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminMenu() {
  const auth = getAuth();
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setCurrentUser(null);
        navigate("/admin");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <nav className="flex justify-evenly w-[93%] bg-indigo-400 text-white font-medium p-4  rounded-xl max-w-screen-md mt-4">
      <a
        onClick={() => navigate("/admin/basvuru-listesi")}
        className="hover:cursor-pointer hover:text-slate-200 "
      >
        Başvuru Listesi
      </a>
      <a
        className="hover:cursor-pointer hover:text-slate-200 "
        onClick={handleSignOut}
      >
        Çıkış
      </a>
    </nav>
  );
}

export default AdminMenu;
