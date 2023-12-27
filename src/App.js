import "./App.css";
import ApplicationForm from "./components/ApplicationForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";

function App() {
  const router = createBrowserRouter([
    { path: "/basvuru-olustur", element: <ApplicationForm /> },
    { path: "/admin", element: <Login /> },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
