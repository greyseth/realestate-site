"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function FormTesting() {
  const [houseId, setHouseId] = useState(1);
  const [thumbnail, setThumbnail] = useState(1);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setPreview(objectURL);

      return () => URL.revokeObjectURL(objectURL);
    }
  }, [file]);

  async function handleSubmit() {
    let formData = new FormData();

    formData.append("house_id", houseId);
    formData.append("thumbnail", thumbnail);
    formData.append("image_upload", file);

    const res = await fetch("http://localhost:3001/houses/uploadimage", {
      method: "POST",
      body: formData,
    });

    console.log(res);
  }

  return (
    <>
      <input
        type="text"
        name="house_id"
        placeholder="House ID"
        value={houseId}
        onChange={(e) => setHouseId(e.target.value)}
        style={{ color: "black" }}
      />
      <input
        type="text"
        name="thumbnail"
        placeholder="Thumbnail"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        style={{ color: "black" }}
      />
      <input
        type="file"
        name="image_upload"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleSubmit}>Submit</button>

      {file && preview ? <Image src={preview} /> : null}
    </>
  );
}
