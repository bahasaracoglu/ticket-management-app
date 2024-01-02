import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Loader from "./Loader";
import AdminMenu from "./AdminMenu";

function UpdateApplication() {
  const appId = useParams().basvuruNo;
  console.log(appId);
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createdDate, setCreatedDate] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [responseInput, setResponseInput] = useState("");

  const handleResponseButtonClick = () => {
    setResponseModalVisible(true);
  };

  const handleSaveResponse = async () => {
    setLoading(true);
    const updateRef = doc(db, "applications", appId);
    await updateDoc(updateRef, { response: responseInput });
    fetchData();
    setLoading(false);
    setResponseModalVisible(false);
  };

  const handleCancelResponse = () => {
    setResponseModalVisible(false);
  };

  const handleUpdateStatusClick = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmUpdateStatus = async () => {
    setLoading(true);
    const updateRef = doc(db, "applications", appId);
    await updateDoc(updateRef, {
      status: applicationData.status === "Çözüldü" ? "Çözülmedi" : "Çözüldü",
    });
    fetchData();
    setLoading(false);
    setShowConfirmationModal(false);
  };

  const handleCancelUpdateStatus = () => {
    setShowConfirmationModal(false);
  };
  const fetchData = async () => {
    try {
      const docRef = doc(db, "applications", appId);
      const docSnap = await getDoc(docRef);
      console.log("data geldi", docSnap.data());

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const dateObj = docSnap.data().createdAt.toDate();
        setCreatedDate(dateObj.toLocaleDateString("tr-TR"));
        setApplicationData(docSnap.data());
        setLoading(false);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [appId]);

  return (
    <section className="min-h-screen flex flex-col  items-center gap-4 ">
      <AdminMenu className="flex self-start  w-[93%] bg-indigo-400 text-white font-medium p-4  rounded-xl max-w-screen-md mt-4" />
      <div className="flex flex-col  w-[93%] p-4 gap-4 rounded-xl max-w-screen-md bg-white shadow-xl md:p-8 min-h-[670px] ">
        <h1 className="py-4 font-bold text-xl">Başvuru Bilgileri</h1>
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <button
            className="p-2 text-white font-bold rounded-xl bg-emerald-600 w-full hover:bg-emerald-500"
            onClick={handleUpdateStatusClick}
          >
            Başvuru Durumunu Güncelle
          </button>

          <button
            className="p-2 text-white font-bold rounded-xl bg-amber-600 w-full hover:bg-amber-500"
            onClick={handleResponseButtonClick}
          >
            Başvuruyu Yanıtla
          </button>
        </div>
        {loading ? (
          <div className="flex  justify-center items-center my-auto">
            <Loader />
          </div>
        ) : (
          <ul className="bg-slate-200 p-4 rounded-xl flex flex-col gap-4 ">
            {showConfirmationModal && (
              <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md  w-[93%] max-w-[500px]">
                  <p>
                    Başvuru durumunu{" "}
                    <span className="font-bold">
                      {applicationData.status === "Çözüldü"
                        ? " çözülmedi "
                        : " çözüldü "}
                    </span>
                    olarak değiştirmek istediğinize emin misiniz?
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCancelUpdateStatus}
                      className="p-2 mr-2 text-white font-bold rounded-md bg-gray-500"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleConfirmUpdateStatus}
                      className="p-2 text-white font-bold rounded-md bg-emerald-600"
                    >
                      Onayla
                    </button>
                  </div>
                </div>
              </div>
            )}{" "}
            {responseModalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
                <div className="bg-white p-4 rounded-md  w-[93%] max-w-[500px]">
                  <textarea
                    rows="4"
                    placeholder="Yanıtınızı buraya yazın..."
                    className="w-full p-2 my-2 border border-gray-300 rounded-md"
                    value={responseInput}
                    onChange={(e) => setResponseInput(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCancelResponse}
                      className="p-2 mr-2 text-white font-bold rounded-md bg-gray-500"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleSaveResponse}
                      className="p-2 text-white font-bold rounded-md bg-emerald-600"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )}
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Ad</span>
              <span className="ml-auto text-left w-1/2 flex flex-wrap">
                {applicationData.firstName}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Soyad</span>
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
              <span className="font-medium w-1/2">Yaş</span>
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
              <span className="font-medium w-1/2">Başvuru Sebebi</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.purposeOfApp}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Başvuru Tarihi</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {createdDate}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Başvuru Durumu </span>

              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationData.status === "Çözüldü" ? (
                  <span className=" text-emerald-700 font-medium">
                    {applicationData.status}
                  </span>
                ) : (
                  <span className=" text-orange-600 font-medium">
                    {applicationData.status}
                  </span>
                )}
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
                {applicationData.additionalFile ? (
                  <a
                    href={applicationData.additionalFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Dosyayı Aç
                  </a>
                ) : (
                  "Mevcut değil"
                )}
              </span>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

export default UpdateApplication;
