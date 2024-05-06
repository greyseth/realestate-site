"use client";

import { useState, useEffect } from "react";
import "../../assets/css/house_new.css";
import Loading from "@/app/components/Loading";
import { get, post } from "@/app/API/API";
import { useRouter } from "next/navigation";
import Message from "@/app/components/Message";
import { useCookies } from "react-cookie";

export default function EditHous({ params }) {
  const router = useRouter();
  const [cookies, setCookies, removeCookies] = useCookies();

  const [message, setMessage] = useState();
  const [imageInputAmount, setImageInputAmount] = useState([0, 1, 2, 3]);

  const [houseName, setHouseName] = useState();
  const [houseTown, setHouseTown] = useState();
  const [houseType, setHouseType] = useState();
  const [houseListing, setHouseListing] = useState();
  const [housePrice, setHousePrice] = useState();

  const [roomCount, setRoomCount] = useState();
  const [bathroomCount, setBathroomCount] = useState();
  const [electricity, setElectricity] = useState();
  const [landArea, setLandArea] = useState();
  const [buildingArea, setBuildingArea] = useState();
  const [certificate, setCertificate] = useState();

  const [promo, setPromo] = useState();
  const [photos, setPhotos] = useState([]);
  const [thumbnail, setThumbnail] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState([]);

  async function handleUpdate() {
    setIsLoading(true);

    let newPhotos = [];
    photos.forEach((p) => {
      if (p) newPhotos.push(p);
    });

    let reqParams = {
      photos: newPhotos,
      thumbnail: thumbnail,
      name: houseName,
      city: houseTown,
      type: houseType,
      room_count: roomCount,
      bathroom_count: bathroomCount,
      electricity: electricity,
      land_area: landArea,
      building_area: buildingArea,
      certificate: certificate,
      listing: houseListing,
      price: housePrice,
    };
    if (promo) reqParams.promo = promo;
    if (tags.length > 0) reqParams.tags = tags;

    const request = await post("/houses/update/" + params.houseId, reqParams);
    if (request.error) {
      setMessage({
        type: "error",
        message: "Sebuah kesalahan telah terjadi...",
        buttons: [{ display: "Tutup", action: () => setMessage(undefined) }],
      });

      console.log(request);
      setIsLoading(false);
      return;
    }

    setMessage({
      type: "success",
      message: "Berhasil mengubah data rumah",
      buttons: [
        {
          display: "Lihat Perubahan",
          action: () => router.push("/house/" + params.houseId),
        },
        { display: "Tutup", action: () => setMessage(undefined) },
      ],
    });
    console.log(request);

    setIsLoading(false);
  }

  async function handleDelete() {
    const result = await post("/houses/delete/" + params.houseId, {
      login_token: cookies.login.login_token,
    });
    if (result.success) {
      router.push("/houses/" + cookies.lastPage ?? "sewa");
    } else {
      setMessage({
        type: "error",
        message: "Sebuah kesalahan telah terjadi saat menghapus. Coba Lagi?",
        buttons: [
          { display: "Ulangi", action: () => handleDelete() },
          { display: "Tutup", action: () => setMessage(undefined) },
        ],
      });

      console.log(result);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const result = await get("/houses/house_images/" + params.houseId);
      if (result.error) {
        setMessage({
          type: "error",
          message: "Sebuah kesalahan terjadi...",
          buttons: [
            { display: "Ulangi", action: () => fetchData() },
            {
              display: "Kembali",
              action: () => {
                router.push("/house/" + params.houseId);
              },
            },
          ],
        });

        console.log(result);
        return;
      }

      const result2 = await get("/houses/thumbnail/" + params.houseId);
      if (result2.error) {
        setMessage({
          type: "error",
          message: "Sebuah kesalahan terjadi...",
          buttons: [
            { display: "Ulangi", action: () => fetchData() },
            {
              display: "Kembali",
              action: () => {
                router.push("/house/" + params.houseId);
              },
            },
          ],
        });

        console.log(result2);
        return;
      }

      const result3 = await get("/houses/id/" + params.houseId);
      if (result3.error) {
        setMessage({
          type: "error",
          message: "Sebuah kesalahan terjadi...",
          buttons: [
            { display: "Ulangi", action: () => fetchData() },
            {
              display: "Kembali",
              action: () => {
                router.push("/house/" + params.houseId);
              },
            },
          ],
        });

        console.log(result3);
        return;
      }

      setHouseName(result3.name);
      setHouseTown(result3.city);
      setHouseType(result3.type);
      setHouseListing(result3.listing);
      setHousePrice(result3.price);
      setPromo(result3.promo);

      setRoomCount(result3.room_count);
      setBathroomCount(result3.bathroom_count);
      setElectricity(result3.electricity);
      setLandArea(result3.land_area);
      setBuildingArea(result3.building_area);
      setCertificate(result3.certificate);

      setPhotos(["", "", "", ""]);
      setPhotos((prev) => {
        let newPhotos = prev;

        for (let i = 0; i < 4; i++) {
          newPhotos[i] = result[i] ?? "";
        }

        return newPhotos;
      });
      setThumbnail(result2[0].name);

      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <>
      {message ? (
        <Message
          type={message.type}
          message={message.message}
          buttons={message.buttons}
        />
      ) : null}

      {isLoading ? (
        <div className="loading-container" style={{ marginTop: "2em" }}>
          <Loading width={"75px"} height={"auto"} />
        </div>
      ) : (
        <div>
          <section className="form-container" style={{ marginTop: "2em" }}>
            <h1>Mengedit Rumah</h1>

            <SpecsInput
              display={"Ubah Nama Rumah"}
              data={houseName}
              setData={setHouseName}
              text={true}
            />
            <SpecsInput
              display={"Ubah Kota Lokasi"}
              data={houseTown}
              setData={setHouseTown}
              text={true}
            />

            <div className="specs-input">
              {houseType ? (
                <p style={{ marginBottom: ".25em" }}>Tipe Rumah</p>
              ) : null}
              <select
                onChange={(e) => setHouseType(e.target.value)}
                className="hover"
              >
                <option
                  selected={houseType === "Townhouse" ? true : false}
                  value={"Townhouse"}
                >
                  Townhouse
                </option>
                <option
                  selected={houseType === "Rumah Subsidi" ? true : false}
                  value={"Rumah Subsidi"}
                >
                  Rumah Subsidi
                </option>
                <option
                  selected={houseType === "Rumah Kosan" ? true : false}
                  value={"Rumah Kosan"}
                >
                  Rumah Kosan
                </option>
              </select>
            </div>

            <div className="specs-input">
              {houseListing ? (
                <p style={{ marginBottom: ".25em" }}>Listing Rumah</p>
              ) : null}
              <select
                onChange={(e) => setHouseListing(e.target.value)}
                className="hover"
              >
                <option
                  selected={houseListing === "sewa" ? true : false}
                  value={"sewa"}
                >
                  Disewakan
                </option>
                <option
                  selected={houseListing === "jual" ? true : false}
                  value={"jual"}
                >
                  Dijual
                </option>
              </select>
            </div>

            <SpecsInput
              display={"Ubah Harga Rumah Permanen (Rp)"}
              data={housePrice}
              setData={setHousePrice}
            />

            <SpecsInput
              display={"Tambahkan Promo Harga (%)"}
              data={promo}
              setData={setPromo}
            />

            <div className="specs-container">
              <SpecsInput
                display={"Jumlah Ruangan"}
                data={roomCount}
                setData={setRoomCount}
              />
              <SpecsInput
                display={"Jumlah Kamar Mandi"}
                data={bathroomCount}
                setData={setBathroomCount}
              />
              <SpecsInput
                display={"Daya Listrik"}
                data={electricity}
                setData={setElectricity}
              />
              <SpecsInput
                display={"Luas Tanah"}
                data={landArea}
                setData={setLandArea}
              />
              <SpecsInput
                display={"Luas Bangunan"}
                data={buildingArea}
                setData={setBuildingArea}
              />
              <SpecsInput
                display={"Sertifikat"}
                data={certificate}
                setData={setCertificate}
                text={true}
              />
            </div>
          </section>

          <section className="new-images-container">
            <div className="images-inputs">
              <h2 style={{ marginBottom: "1em" }}>Gambar Rumah</h2>
              {imageInputAmount.map((i) => {
                return (
                  <ImageInput
                    key={i}
                    photos={photos}
                    setPhotos={setPhotos}
                    photosIndex={i}
                    setIsLoading={setIsLoading}
                  />
                );
              })}
            </div>
            <div className="thumbnail-input">
              <h2 style={{ marginBottom: "1em" }}>Thumbnail Rumah</h2>
              <ImageInput
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
                setIsLoading={setIsLoading}
              />
            </div>
          </section>

          <div className="submit-container">
            <h2 style={{ marginBottom: "1em" }}>Tags</h2>
            <HouseTags
              house_id={params.houseId}
              tags={tags}
              setTags={setTags}
            />
          </div>

          <section className="submit-container">
            <button
              className="primary-btn hover scale to-tertiary-fg"
              style={{
                borderRadius: "10px",
                padding: "1em",
                fontSize: "1em",
                marginRight: "2em",
              }}
              onClick={handleUpdate}
            >
              Simpan Perubahan
            </button>
            <button
              className="primary-btn hover scale to-tertiary-fg"
              style={{ borderRadius: "10px", padding: "1em", fontSize: "1em" }}
              onClick={handleDelete}
            >
              Hapus Rumah
            </button>
          </section>
        </div>
      )}
    </>
  );
}

function SpecsInput({ display, data, setData, text }) {
  return (
    <div className="specs-input">
      {data ? <p style={{ marginBottom: ".25em" }}>{display}</p> : null}
      <input
        placeholder={display}
        value={data}
        onChange={(e) => setData(e.target.value)}
        type={!text ? "number" : null}
      />
    </div>
  );
}

function ImageInput({
  photos,
  setPhotos,
  photosIndex,
  thumbnail,
  setThumbnail,
}) {
  const [file, setFile] = useState();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function uploadImage() {
      setUploading(true);

      let formData = new FormData();
      formData.append("image_upload", file);
      const request = await fetch("http://localhost:3001/houses/tempimage", {
        method: "POST",
        body: formData,
      });

      const result = await request.json();
      console.log(result);

      if (result.success) {
        if (!thumbnail) {
          let newPhotos = photos;
          newPhotos[photosIndex] = { name: result.image };

          setPhotos(newPhotos);

          console.log(photos);
        } else setThumbnail(result.image);
      } else {
        alert("Tidak bisa mengupload gambar. Coba lagi.");
        console.log(result);
      }

      setUploading(false);
    }

    if (file) {
      uploadImage();
    }
  }, [file]);

  return (
    <div className="image-input">
      {thumbnail ?? photos[photosIndex] ? (
        <div>
          <img
            src={
              "http://localhost:3001/houses/image/" +
              (!thumbnail ? photos[photosIndex].name : thumbnail)
            }
            alt="House Image"
          />
          {!thumbnail ? (
            <button
              className="primary-btn hover scale to-tertiary-fg"
              style={{
                borderRadius: "10px",
                padding: "1em",
                marginBottom: "1em",
              }}
              onClick={(e) => {
                const newPhotos = photos.slice(photosIndex);
                newPhotos[photosIndex] = "";

                setPhotos(newPhotos);
              }}
            >
              Hapus Foto
            </button>
          ) : (
            <div>
              <label style={{ marginTop: "1em" }}>Ubah Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                className="primary-btn hover to-tertiary-fg"
                style={{
                  borderRadius: "10px",
                  padding: "1em",
                  marginBottom: "1em",
                }}
                disabled={uploading}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          )}
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          className="primary-btn hover to-tertiary-fg"
          style={{ borderRadius: "10px", padding: "1em", marginBottom: "1em" }}
          disabled={uploading}
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}
    </div>
  );
}

function HouseTags({ house_id, tags, setTags }) {
  const [newTagInput, setNewTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("New Tag");
  const [loading, setLoading] = useState(true);

  const [cookies, setCookies, removeCookies] = useCookies();

  useEffect(() => {
    async function getTags() {
      const result = await get("/houses/tags/" + house_id);

      if (result) {
        if (result.empty) {
          setTags([]);
          setLoading(false);
          return;
        }

        if (!result.error) {
          setTags(result);
          setLoading(false);
        }
      }
    }

    getTags();
  }, []);

  useEffect(() => {
    if (newTagInput) document.querySelector("#taginput").select();
  }, [newTagInput]);

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <Loading width={"75px"} height={"auto"} />
        </div>
      ) : (
        <div className="tag-container">
          {tags ? (
            tags.map((t, i) => {
              return (
                <p
                  key={i}
                  className="secondary-btn hover"
                  style={{ border: "none", borderRadius: "5px" }}
                  onClick={(e) => {
                    setTags(tags.filter((tt) => tt !== t));
                  }}
                >
                  {t}
                </p>
              );
            })
          ) : (
            <p>No Tags Found</p>
          )}

          {newTagInput ? (
            <input
              type="text"
              className="secondary-btn"
              id="taginput"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  let tags2 = tags;
                  tags2.push(tagInput);
                  setTags(tags2);

                  setNewTagInput(false);
                  setTagInput("New Tag");
                } else if (e.key === "Escape") {
                  setNewTagInput(false);
                  setTagInput("New Tag");
                }
              }}
            />
          ) : (
            <p
              className="secondary-btn hover"
              style={{ border: "none", borderRadius: "5px" }}
              onClick={(e) => {
                setNewTagInput(true);
              }}
            >
              +
            </p>
          )}
        </div>
      )}
    </div>
  );
}
