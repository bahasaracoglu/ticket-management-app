import { getAuth, signOut } from "firebase/auth";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

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
    <nav className="flex justify-evenly">
      <a onClick={() => navigate("/admin/basvuru-listesi")}>Başvuru Listesi</a>
      <a onClick={handleSignOut}>Çıkış</a>
    </nav>
  );
}

export default AdminMenu;
