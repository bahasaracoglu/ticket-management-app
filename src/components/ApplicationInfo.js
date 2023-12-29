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
    <div>
      <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Bilgileri</h1>
      {applicationData && (
        <div>
          <p>Ad: {applicationData.firstName}</p>
          <p>Soyad: {applicationData.lastName}</p>
          <p>Yaş: {applicationData.age}</p>
          <p>TC Kimlik No: {applicationData.tcNo}</p>
          <p>Başvuru Nedeni: {applicationData.purposeOfApp}</p>
          <p>Adres: {applicationData.address}</p>
          <p>
            Ek Dosya:{" "}
            <a
              href={applicationData.additionalFile}
              target="_blank"
              rel="noopener noreferrer"
            >
              Dosyayı Aç
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default ApplicationInfo;
