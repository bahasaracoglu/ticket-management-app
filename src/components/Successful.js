import React from "react";

function Successful({ applicationInfo }) {
  return (
    <div>
      {applicationInfo && (
        <ul>
          Successful
          <li>Ad: {applicationInfo.firstName}</li>
          <li>Soyad: {applicationInfo.lastName}</li>
          <li>Başvuru Sebebi: {applicationInfo.purposeOfApp}</li>
          <li>Başvuru Kodu: {applicationInfo.id}</li>
        </ul>
      )}
    </div>
  );
}

export default Successful;
