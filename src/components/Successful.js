import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";

function Successful({ applicationInfo }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      {applicationInfo && (
        <section className="flex flex-col my-6 w-[93%] p-8 gap-4 rounded-xl max-w-screen-md bg-white shadow-xl">
          <h1 className="font-bold text-xl">
            Teşekkürler, başvurunuz alınmıştır.
          </h1>
          <h2 className="font-medium">Başvuru Detayları:</h2>
          <ul className="bg-slate-200 p-4 rounded-xl flex flex-col gap-4">
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Ad:</span>
              <span className="ml-auto text-left w-1/2 flex flex-wrap">
                {applicationInfo.firstName}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Soyad:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationInfo.lastName}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-indigo-200 pb-2">
              <span className="font-medium w-1/2">Başvuru Sebebi:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationInfo.purposeOfApp}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="font-medium w-1/2">Başvuru Kodu:</span>
              <span className="ml-auto text-left w-1/2 overflow-hidden overflow-ellipsis">
                {applicationInfo.id}
              </span>
            </li>
            <div className="flex flex-col gap-2 justify-center">
              {copied && (
                <span className=" text-green-600 text-center">Kopyalandı!</span>
              )}
              <CopyToClipboard text={applicationInfo.id} onCopy={handleCopy}>
                <button className="p-2 w-full bg-sky-600 text-white rounded-md cursor-pointer">
                  Başvuru Kodunu Kopyala
                </button>
              </CopyToClipboard>
              <div>
                <button
                  className="p-2 w-full bg-emerald-600 text-white rounded-md cursor-pointer"
                  onClick={() => navigate("/basvuru-sorgula")}
                >
                  Başvuru Sorgula
                </button>
              </div>
            </div>
          </ul>
        </section>
      )}
    </div>
  );
}

export default Successful;
