import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import AdminMenu from "./AdminMenu";

function ApplicationsList() {
  const [appList, setAppList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "applicationspatika"));
      // console.log(querySnapshot);
      if (querySnapshot) {
        const applications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log();
        setAppList(applications);
        setLoading(false);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };
  const filterData = async () => {
    setLoading(true);
    await fetchData();
    const filteredApplications = appList.filter(
      (app) => app.status === "Bekliyor"
    );
    setAppList(filteredApplications);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
      <AdminMenu className="flex self-start  w-[93%] bg-indigo-400 text-white font-medium p-4  rounded-xl max-w-screen-md mt-4" />
      <div className="flex flex-col  my-6 w-[93%] p-4 gap-4 rounded-xl max-w-screen-md bg-white shadow-xl md:p-8 min-h-[670px] ">
        <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Listesi</h1>
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <button
            className="p-2 text-white font-bold rounded-xl bg-amber-700 w-full hover:bg-amber-600"
            onClick={filterData}
          >
            Bekleyen Başvurular
          </button>

          <button
            className="p-2 text-white font-bold rounded-xl bg-slate-500 w-full hover:bg-slate-400"
            onClick={fetchData}
          >
            Tüm Başvurular
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center my-auto ">
            <Loader />
          </div>
        ) : (
          <ul className=" flex flex-col gap-4">
            {appList.map((app) => (
              <li key={app.id} className="bg-slate-200 p-4 rounded-xl">
                <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                  <span className="font-medium w-1/2">Ad-Soyad</span>
                  <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                    {app.firstName} {app.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-indigo-200 py-2">
                  <span className="font-medium w-1/2">Oluşturulma Tarihi</span>
                  <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                    {app.createdAt.toDate().toLocaleString()}
                  </span>
                </div>{" "}
                <div className="flex justify-between items-center border-b border-indigo-200 py-2">
                  <span className="font-medium w-1/2">Başvuru Durumu</span>
                  <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                    {app.status === "Çözüldü" && (
                      <span className=" text-emerald-700 font-medium">
                        {app.status}
                      </span>
                    )}
                    {app.status === "Bekliyor" && (
                      <span className=" text-yellow-600 font-medium">
                        {app.status}
                      </span>
                    )}
                    {app.status === "İptal Edildi" && (
                      <span className=" text-red-600 font-medium">
                        {app.status}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl mt-3 p-1 bg-emerald-700 text-white font-medium w-[170px]">
                  <Link
                    to={`/admin/basvuru/${app.id}`}
                    className="hover:text-blue-700"
                  >
                    Başvuruyu Görüntüle
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default ApplicationsList;
