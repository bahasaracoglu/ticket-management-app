import { useEffect, useState } from "react";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import Loader from "./Loader";

function ApplicationInfo() {
  const applicationId = useParams().basvuruNo;
  console.log(applicationId);
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createdDate, setCreatedDate] = useState(null); // Değişiklik burada

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "applications", applicationId);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setApplicationData(docSnap.data());
          const dateObj = docSnap.data().createdAt.toDate();
          setCreatedDate(dateObj.toLocaleDateString("tr-TR"));
          setLoading(false);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData(); // Veriyi çekmek için işlevi çağırın.
  }, [applicationId]); // useEffect'i sadece applicationId değiştiğinde çalıştır

  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col my-6 w-5/6 p-8 gap-4 rounded-xl max-w-screen-md bg-white shadow-xl">
        <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Bilgileri</h1>
        {loading ? (
          <Loader />
        ) : (
          <ul className="bg-slate-200 p-4 rounded-xl flex flex-col gap-4">
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Ad:</span>
              <span className="ml-auto text-left w-1/2 flex flex-wrap">
                {applicationData.firstName}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Soyad:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.lastName}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">T.C. Kimlik Numarası</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.tcNo}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Yaş:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.age}
              </span>
            </li>{" "}
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Adres</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.address}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Başvuru Sebebi:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.purposeOfApp}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Başvuru Tarihi:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {createdDate}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Başvuru Durumu:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.status}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Başvuru Yanıtı</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.response || "Henüz yanıtlanmadı"}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Ek Dosya</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                <a
                  href={applicationData.additionalFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-medium"
                >
                  Dosyayı Aç
                </a>
              </span>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

export default ApplicationInfo;
