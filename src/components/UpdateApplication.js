import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Loader from "./Loader";

function UpdateApplication() {
  const appId = useParams().basvuruNo;
  console.log(appId);
  const [applicationData, setApplicationData] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const handleResponseButtonClick = () => {
    setIsInputVisible(true);
  };

  const handleResponseSubmit = () => {
    // Cevap veritabanına gönderilir veya başka bir işlem yapılır.
    console.log("Cevap gönderildi:", responseText);

    // Input alanını gizle
    setIsInputVisible(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "applications", appId);
        const docSnap = await getDoc(docRef);
        console.log("data geldi", docSnap.data());

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setApplicationData(docSnap.data());
          setLoading(false);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData(); // Veriyi çekmek için işlevi çağırın.
  }, [appId]); // useEffect'i sadece applicationId değiştiğinde çalıştır

  return (
    <div>
      <h1 className="pt-8 pb-8 font-bold text-xl">Başvuru Bilgileri</h1>
      {loading ? (
        <Loader />
      ) : (
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
          <p>Başvuru Durumu: {applicationData.status}</p>
          <p>Cevap: {applicationData.response}</p>
          <div>
            <button>Başvuru Durumunu Güncelle</button>
            <div>
              <button onClick={handleResponseButtonClick}>Cevap Yaz</button>
              {isInputVisible && (
                <div>
                  <input
                    type="text"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <button onClick={handleResponseSubmit}>Gönder</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateApplication;
