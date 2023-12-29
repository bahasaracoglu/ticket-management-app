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
