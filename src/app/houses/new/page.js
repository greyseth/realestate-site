"use client";

import Image from "next/image";
import "../../assets/css/house_new.css";
import Majima from "../../assets/img/majima.jpeg";
import BackIcon from "../../assets/img/icons/back_icon.svg";

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/app/API/API";
import Message from "@/app/components/Message";
import Loading from "@/app/components/Loading";

export default function NewHouse() {
  const [houseName, setHouseName] = useState();
  const [houseTown, setHouseTown] = useState();
  const [houseType, setHouseType] = useState();
  const [houseListing, setHouseListing] = useState();
  const [housePrice, setHousePrice] = useState();

  //made into separate states because I want to make it modular
  const [roomCount, setRoomCount] = useState();
  const [electricity, setElectricity] = useState();
  const [buildingArea, setBuildingArea] = useState();
  const [landArea, setLandArea] = useState();
  const [bathroomCount, setBathroomCount] = useState();
  const [certificate, setCertificate] = useState();

  const [photos, setPhotos] = useState(["", "", "", ""]);
  const [thumbnailImg, setThumbnailImg] = useState([]);

  const [tags, setTags] = useState([]);

  const [imageInputAmount, setImageInputAmount] = useState([0, 1, 2, 3]);

  const [cookies, setCookies, removeCookies] = useCookies();
  const [message, setMessage] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!cookies.login)
      router.push(cookies.lastPage ? "/houses/" + cookies.lastPage : "/");
  }, []);

  async function handleSubmit() {
    // Warn if overriding existing method
    if (Array.prototype.equals)
      console.warn(
        "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
      );
    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
      // if the other array is a falsy value, return
      if (!array) return false;
      // if the argument is the same array, we can be sure the contents are same as well
      if (array === this) return true;
      // compare lengths - can save a lot of time
      if (this.length != array.length) return false;

      for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].equals(array[i])) return false;
        } else if (this[i] != array[i]) {
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;
        }
      }
      return true;
    };
    // Hide method from for-in loops
    Object.defineProperty(Array.prototype, "equals", { enumerable: false });

    if (
      !houseName ||
      !houseTown ||
      !houseType ||
      !houseListing ||
      !housePrice ||
      !roomCount ||
      !electricity ||
      !buildingArea ||
      !landArea ||
      !bathroomCount ||
      !certificate ||
      !thumbnailImg
    ) {
      setMessage({
        type: "notice",
        message: "Semua data (kecuali gambar rumah) harus terisi!",
        buttons: [
          {
            display: "Tutup",
            action: () => setMessage(undefined),
          },
        ],
      });

      return;
    }

    let newHouseId = 0;
    let newPhotos = undefined;
    const result = await post("/houses/new", {
      user_id: cookies.login.login_id,
      name: houseName,
      city: houseTown,
      type: houseType,
      price: housePrice,
      listing: houseListing,
      room_count: roomCount,
      bathroom_count: bathroomCount,
      electricity: electricity,
      land_area: landArea,
      building_area: buildingArea,
      certificate: certificate,
    });

    if (result.success) {
      newHouseId = result.house_id;
      if (!photos.equals(["", "", "", ""])) {
        newPhotos = [];
        photos.forEach((p) => {
          if (p) newPhotos.push(p);
        });
      }

      const result2 = await post("/houses/newimages", {
        house_id: newHouseId,
        photos: newPhotos,
        thumbnail: thumbnailImg,
      });

      if (result2.success) {
        if (tags.length > 0) {
          const result3 = await post("/houses/newtags", {
            house_id: newHouseId,
            tags: tags,
          });

          if (result3.success) {
            router.replace("/house/" + newHouseId, "/houses/new");
          } else {
            setMessage({
              type: "error",
              message: "Sebuah kesalahan terjadi saat menambahkan...",
              buttons: [
                {
                  display: "Ulangi",
                  action: () => handleSubmit(),
                },
                {
                  display: "Tutup",
                  action: () => setMessage(undefined),
                },
              ],
            });

            console.log(result3);
          }
        } else router.replace("/house/" + newHouseId, "/houses/new");
      } else {
        setMessage({
          type: "error",
          message: "Sebuah kesalahan terjadi saat menambahkan...",
          buttons: [
            {
              display: "Ulangi",
              action: () => handleSubmit(),
            },
            {
              display: "Tutup",
              action: () => setMessage(undefined),
            },
          ],
        });

        console.log(result2);
      }
    } else {
      setMessage({
        type: "error",
        message: "Sebuah kesalahan terjadi saat menambahkan...",
        buttons: [
          {
            display: "Ulangi",
            action: () => handleSubmit(),
          },
          {
            display: "Tutup",
            action: () => setMessage(undefined),
          },
        ],
      });

      console.log(result);
    }
  }

  return (
    <>
      {message ? (
        <Message
          type={message.type}
          message={message.message}
          buttons={message.buttons}
        />
      ) : null}

      <div
        className="page-return hover to-tertiary-fg"
        onClick={(e) => {
          router.push(cookies.lastPage ? "/houses/" + cookies.lastPage : "/");
        }}
      >
        <Image src={BackIcon} alt="Return icon" />
        <p>Kembali</p>
      </div>

      <section className="form-container">
        <h1 className="add-title">Tambahkan Rumah</h1>

        <div className="basic-info-container">
          <SpecsInput
            display={"Nama Rumah"}
            data={houseName}
            setData={setHouseName}
            text={true}
          />
          <SpecsInput
            display={"Kota Lokasi"}
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
              <option selected={!houseType ? true : false} value={""}>
                Pilih Tipe Rumah
              </option>
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
              <option selected={!houseListing ? true : false} value={""}>
                Pilih Listing Rumah
              </option>
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
            display={"Harga Rumah (Rp)"}
            data={housePrice}
            setData={setHousePrice}
          />
        </div>

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
            return <ImageInput setPhotos={setPhotos} index={i} key={i} />;
          })}
        </div>
        <div className="thumbnail-input">
          <h2 style={{ marginBottom: "1em" }}>Thumbnail Rumah</h2>
          <ImageInput thumbnail={true} setThumbnailImg={setThumbnailImg} />
        </div>
      </section>

      <div className="submit-container">
        <h2 style={{ marginBottom: "1em" }}>Tags</h2>
        <HouseTags tags={tags} setTags={setTags} />
      </div>

      <section className="submit-container">
        <button
          className="primary-btn hover scale to-tertiary-fg"
          style={{ borderRadius: "10px", padding: "1em", fontSize: "1em" }}
          onClick={handleSubmit}
        >
          Tambahkan Rumah
        </button>
      </section>
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

function ImageInput({ thumbnail, setPhotos, setThumbnailImg, index }) {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();

  useEffect(() => {
    async function uploadImage() {
      let formData = new FormData();

      formData.append("image_upload", file);

      const request = await fetch("http://localhost:3001/houses/tempimage", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();

      if (response.success) {
        setFileName(response.image);
        if (!thumbnail)
          setPhotos((prev) => {
            let newArray = prev;
            newArray[index] = response.image;

            return newArray;
          });
        else setThumbnailImg(response.image);
      }
    }

    if (file) uploadImage();
  }, [file]);

  return (
    <div className="image-input">
      {fileName ? (
        <div>
          <img src={"http://localhost:3001/houses/image/" + fileName} />
          <button
            className="primary-btn hover scale to-white-fg"
            style={{
              borderRadius: "10px",
              padding: "1em",
              marginBottom: "1em",
            }}
            onClick={(e) => {
              setFileName(undefined);
              setFile(undefined);
            }}
          >
            Hapus Foto
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          className="primary-btn hover to-tertiary-fg"
          style={{ borderRadius: "10px", padding: "1em", marginBottom: "1em" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}
    </div>
  );
}

function HouseTags({ tags, setTags }) {
  const [newTagInput, setNewTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("New Tag");

  useEffect(() => {
    if (newTagInput) document.querySelector("#taginput").select();
  }, [newTagInput]);

  return (
    <div>
      <div className="tag-container">
        {tags
          ? tags.map((t, i) => {
              return (
                <p
                  key={i}
                  className="secondary-btn hover"
                  style={{ border: "none", borderRadius: "5px" }}
                  onClick={(e) => {
                    //Removes tag
                    setTags(tags.filter((tt) => tt !== t));
                  }}
                >
                  {t}
                </p>
              );
            })
          : null}

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
    </div>
  );
}
