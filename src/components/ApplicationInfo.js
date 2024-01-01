import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";

function ApplicationInfo() {
  const applicationId = useParams().basvuruNo;
  console.log(applicationId);
  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "applications", applicationId);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setApplicationData(docSnap.data());
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
    <section className="min-h-screen flex  justify-center items-center   ">
      <div className="flex flex-col my-6 w-5/6 p-8 gap-4 rounded-xl bg-white shadow-xl lg:w-3/6 ">
        <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Bilgileri</h1>
        {applicationData && (
          <ul className=" bg-slate-200 p-2 rounded-xl flex flex-col">
            <li>Ad: {applicationData.firstName}</li>
            <li>Soyad: {applicationData.lastName}</li>
            <li>Yaş: {applicationData.age}</li>
            <li>TC Kimlik No: {applicationData.tcNo}</li>
            <li>Başvuru Nedeni: {applicationData.purposeOfApp}</li>
            <li>Adres: {applicationData.address}</li>
            <li>
              Ek Dosya:
              <a
                href={applicationData.additionalFile}
                target="_blank"
                rel="noopener noreferrer"
              >
                Dosyayı Aç
              </a>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

export default ApplicationInfo;
