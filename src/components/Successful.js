import React from "react";

function Successful({ applicationInfo }) {
  return (
    <div className="min-h-screen flex  justify-center items-center  ">
      {applicationInfo && (
        <section className="flex flex-col my-6 w-5/6  p-8 gap-4 rounded-xl bg-white shadow-xl lg:w-3/6">
          <h1 className=" font-bold text-xl">
            {" "}
            Teşekkürler, başvurunuz alınmıştır.
          </h1>
          <h2 className=" font-medium">Başvuru Detayları:</h2>
          <ul className=" bg-slate-200 p-2 rounded-xl flex flex-col">
            <li>
              <span className=" font-medium">Ad:</span>
              <span> {applicationInfo.firstName}</span>
            </li>
            <li>
              <span className=" font-medium">Soyad:</span>
              <span> {applicationInfo.lastName}</span>
            </li>
            <li>
              <span className=" font-medium">Başvuru Sebebi:</span>
              <span>{applicationInfo.purposeOfApp}</span>
            </li>
            <li>
              <span className=" font-medium">Başvuru Kodu:</span>
              <span> {applicationInfo.id}</span>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}

export default Successful;
