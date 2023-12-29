import "./App.css";
import ApplicationForm from "./components/ApplicationForm";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";
import ApplicationsList from "./components/ApplicationsList";
import { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";
import Successful from "./components/Successful";
import ApplicationInquiry from "./components/ApplicationInquiry";
import ApplicationInfo from "./components/ApplicationInfo";

function App() {
  const { currentUser } = useContext(AuthContext);
  const [applicationInfo, setApplicationInfo] = useState(null);

  //const currentUser = false;
  console.log(currentUser);
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/admin" />;
  };
  const router = createBrowserRouter([
    {
      path: "/basvuru-olustur",
      element: <ApplicationForm setApplicationInfo={setApplicationInfo} />,
    },
    {
      path: "/basvuru-basarili",
      element: <Successful applicationInfo={applicationInfo} />,
    },
    {
      path: "/basvuru-sorgula",
      element: <ApplicationInquiry />,
    },
    {
      path: "/basvuru/:basvuruNo",
      element: <ApplicationInfo />,
    },
    { path: "/admin", element: <Login /> },
    {
      path: "/admin/basvuru-listesi",
      element: (
        <RequireAuth>
          <ApplicationsList />
        </RequireAuth>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
