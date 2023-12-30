import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Loader from "./Loader";

function ApplicationsList() {
  const [appList, setAppList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "applications"));

        // querySnapshot.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, " => ", doc.data());
        // });
        console.log(querySnapshot);

        if (querySnapshot) {
          const applications = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppList(applications);
          setLoading(false);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData(); // Veriyi çekmek için işlevi çağırın.
  }, []); // useEffect'i sadece applicationId değiştiğinde çalıştır
  return (
    <div>
      <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Listesi</h1>
      {loading ? (
        <Loader />
      ) : (
        <ul>
          {appList.map((app) => (
            <li key={app.id}>
              <p>
                Ad-Soyad: {app.firstName} {app.lastName}
              </p>

              <p>
                Oluşturulma Tarihi: {app.createdAt.toDate().toLocaleString()}
              </p>
              <p>
                <Link to={`/admin/basvuru-listesi/${app.id}`}>Görüntüle </Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ApplicationsList;
