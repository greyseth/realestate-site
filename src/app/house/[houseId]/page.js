"use client";

import Image from "next/image";
import "../../assets/css/house_details.css";
import BackIcon from "../../assets/img/icons/back_icon.svg";
import EditIcon from "../../assets/img/icons/edit_icon.svg";
import MissingImage from "../../assets/img/icons/image_icon.svg";
import WhatsappIcon from "../../assets/img/icons/whatsapp.svg";
import PhoneIcon from "../../assets/img/icons/phone_icon.svg";
import BedIcon from "../../assets/img/icons/bed_icon.svg";
import ToiletIcon from "../../assets/img/icons/toilet_icon.svg";
import ElectricityIcon from "../../assets/img/icons/electricity_icon.svg";
import LuasTanahIcon from "../../assets/img/icons/luas_tanah_icon.svg";
import LuasBangunanIcon from "../../assets/img/icons/luas_bangunan_icon.svg";
import CertificateIcon from "../../assets/img/icons/certificate_icon.svg";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { get, post } from "@/app/API/API";
import Loading from "@/app/components/Loading";
import Message from "@/app/components/Message";
import Avatar from "@/app/components/Avatar.";
import CursorBox from "@/app/components/CursorBox";
import { useCookies } from "react-cookie";

export default function HouseDisplay({ params }) {
  const [message, setMessage] = useState(undefined);
  const [cursorBox, setCursorBox] = useState({ msg: "", showing: false });
  const [canEdit, setCanEdit] = useState(false);
  const [viewingImage, setViewingImage] = useState(undefined);

  const [houseData, setHouseData] = useState({
    data: undefined,
    loading: true,
  });

  const router = useRouter();
  const [cookies, setCookies, removeCookies] = useCookies();

  async function fetchData() {
    const result = await get("/houses/id/" + params.houseId);

    if (!result || result.error) {
      setMessage({
        type: "error",
        message: "Sebuah Kesalahan Terjadi :(",
        buttons: [
          {
            display: "Kembali",
            action: () => {
              router.push("/");
            },
          },
          {
            display: "Coba Lagi",
            action: () => {
              fetchData();
            },
          },
        ],
      });

      return;
    }

    if (result.empty) {
      setMessage({
        type: "notice",
        message: "Id Rumah Tidak Ditemukan",
        buttons: [
          {
            display: "Kembali",
            action: () => {
              router.push("/");
            },
          },
        ],
      });

      return;
    }

    // setHouseData({ data: result, loading: false });
    if (cookies.login) {
      const result2 = await post("/houses/checkownership", {
        checkId: result.user_id,
        checkToken: cookies.login.login_token,
      });
      console.log(result2);

      if (!result2 || result2.error) {
        setMessage({
          type: "error",
          message: "Tidak bisa mengkonfirmasi kepemilikan rumah...",
          buttons: [
            {
              display: "Kembali",
              action: () => {
                router.push("/");
              },
            },
          ],
        });

        console.log(result2);
      } else setCanEdit(result2.owner);

      setHouseData({ data: result, loading: false });
    } else setHouseData({ data: result, loading: false });
  }

  useEffect(() => {
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

      {cursorBox.showing ? (
        <CursorBox msg={cursorBox.msg} showing={cursorBox.showing} />
      ) : null}

      {viewingImage ? (
        <ImageView
          viewingImage={viewingImage}
          setViewingImage={setViewingImage}
        />
      ) : null}

      {canEdit ? <EditPanel house_id={houseData.data.house_id} /> : null}

      <div
        className="page-return hover to-tertiary-fg"
        onClick={(e) => {
          router.push("/houses/" + cookies.lastPage);
        }}
      >
        <Image src={BackIcon} />
        <p>Kembali</p>
      </div>

      {houseData.loading ? (
        <div className="loading-container">
          <Loading width={"10%"} height={"auto"} />
        </div>
      ) : (
        <HouseContent
          houseData={houseData.data}
          setCursorBox={setCursorBox}
          setMessage={setMessage}
          setViewingImage={setViewingImage}
        />
      )}
    </>
  );
}

function HouseContent({
  houseData,
  setCursorBox,
  setMessage,
  setViewingImage,
}) {
  const [images, setImages] = useState({ data: undefined, loading: true });

  const router = useRouter();

  useEffect(() => {
    async function loadImages() {
      const result = await get("/houses/house_images/" + houseData.house_id);

      if (result.error) {
        setMessage({
          type: "error",
          message: "Sebuah kesalahan terjadi saat mengambil gambar",
          buttons: [
            {
              display: "Tutup",
              action: () => {
                setMessage(undefined);
              },
            },
          ],
        });
        console.log(result);
        return;
      }

      if (result.empty) {
        setMessage({
          type: "notice",
          message: "Rumah ini tidak memiliki gambar",
          buttons: [
            {
              display: "Tutup",
              action: () => {
                setMessage(undefined);
              },
            },
          ],
        });

        setImages({ data: [], loading: false });
        return;
      }

      setImages({ data: result, loading: false });
    }

    loadImages();
  }, []);

  function cursorBoxEnter() {
    setCursorBox({ msg: "View Full Image", showing: true });
  }

  function cursorBoxLeave() {
    setCursorBox({ msg: "", showing: false });
  }

  function viewImage(image) {
    setViewingImage(image);
  }

  return (
    <div>
      <section className="images-container">
        {images.loading ? (
          <div className="loading-container">
            <Loading width={75} height={"auto"} />
          </div>
        ) : (
          <div className="images">
            {images.data[0] ? (
              <img
                src={
                  "http://localhost:3001/houses/image/" + images.data[0].name
                }
                alt="House Image"
                onMouseEnter={cursorBoxEnter}
                onMouseLeave={cursorBoxLeave}
                onClick={(e) => {
                  setViewingImage(images.data[0].name);
                }}
              />
            ) : (
              <Image src={MissingImage} />
            )}
            {images.data[1] ? (
              <img
                src={
                  "http://localhost:3001/houses/image/" + images.data[1].name
                }
                alt="House Image"
                onMouseEnter={cursorBoxEnter}
                onMouseLeave={cursorBoxLeave}
                onClick={(e) => {
                  setViewingImage(images.data[1].name);
                }}
              />
            ) : (
              <Image src={MissingImage} />
            )}
            {images.data[2] ? (
              <img
                src={
                  "http://localhost:3001/houses/image/" + images.data[2].name
                }
                alt="House Image"
                onMouseEnter={cursorBoxEnter}
                onMouseLeave={cursorBoxLeave}
                onClick={(e) => {
                  setViewingImage(images.data[2].name);
                }}
              />
            ) : (
              <Image src={MissingImage} />
            )}
            {images.data[3] ? (
              <img
                src={
                  "http://localhost:3001/houses/image/" + images.data[3].name
                }
                alt="House Image"
                onMouseEnter={cursorBoxEnter}
                onMouseLeave={cursorBoxLeave}
                onClick={(e) => {
                  setViewingImage(images.data[3].name);
                }}
              />
            ) : (
              <Image src={MissingImage} />
            )}
          </div>
        )}
        <div className="thumbnail">
          <img
            src={"http://localhost:3001/houses/image/" + houseData.thumbnail}
            alt="House Thumbnail"
            onMouseEnter={cursorBoxEnter}
            onMouseLeave={cursorBoxLeave}
            onClick={(e) => {
              setViewingImage(houseData.thumbnail);
            }}
          />
        </div>
      </section>

      <section className="info-container">
        <div className="owner-info">
          <h2>Tanya Tentang Rumah Ini</h2>
          <div
            className="owner-profile hover"
            onClick={(e) => {
              router.push("/account/" + houseData.user_id);
            }}
          >
            <Avatar filename={houseData.avatar} />
            <div>
              <p>
                {houseData.first_name} {houseData.last_name}
              </p>
              <p>Agen Independen</p>
            </div>
          </div>

          <div className="controls">
            <button
              onClick={(e) => {
                let cleanedNumber = houseData.phone;
                if (cleanedNumber.startsWith("0")) cleanedNumber.slice(1);

                //exclusively in Indonesia, so just +62
                window.open("https://wa.me/+62" + cleanedNumber, "_blank");
              }}
            >
              <Image src={WhatsappIcon} width={25} height={25} />
              <p>WhatsApp</p>
            </button>
            <button
              className="hover to-white-bg to-secondary-fg"
              onClick={(e) => {
                navigator.clipboard.writeText(houseData.phone);
                setMessage({
                  type: "notice",
                  message: "Nomor telah tersalin",
                  buttons: [
                    {
                      display: "Tutup",
                      action: () => {
                        setMessage(undefined);
                      },
                    },
                  ],
                });
              }}
            >
              <Image src={PhoneIcon} width={25} height={25} />
              <p>{houseData.phone}</p>
            </button>
          </div>
        </div>
        <div className="house-info">
          <div className="house-info-header">
            <h2>{houseData.name}</h2>
            <p>{houseData.city}</p>
          </div>

          <div className="house-info-body">
            <h2>Informasi Properti</h2>
            <p style={{ marginBottom: "2em" }}>Spesifikasi</p>

            <div className="house-info-feats">
              <HouseInfoItem
                img={BedIcon}
                text={"Kamar Tidur: " + houseData.room_count}
              />
              <HouseInfoItem
                img={ToiletIcon}
                text={"Kamar Mandi: " + houseData.bathroom_count}
              />
              <HouseInfoItem
                img={ElectricityIcon}
                text={"Daya Listrik: " + houseData.electricity}
              />
              <HouseInfoItem
                img={LuasTanahIcon}
                text={"Luas Tanah: " + houseData.land_area + "m²"}
              />
              <HouseInfoItem
                img={LuasBangunanIcon}
                text={"Luas Bangunan: " + houseData.building_area + "m²"}
              />
              <HouseInfoItem
                img={CertificateIcon}
                text={"Sertifikat: " + houseData.certificate}
              />
            </div>
          </div>
        </div>

        <div className="house-info-footer">
          <h2>Tags</h2>
          <HouseTags house_id={houseData.house_id} />
        </div>
      </section>
    </div>
  );
}

function ImageView({ viewingImage, setViewingImage }) {
  return (
    <section className="image-view">
      <Image
        src={BackIcon}
        width={50}
        height={50}
        className="image-back hover scale"
        onClick={(e) => {
          setViewingImage(undefined);
        }}
      />
      <div className="image-container">
        <img
          src={"http://localhost:3001/houses/image/" + viewingImage}
          alt="Full Sized Image"
        />
      </div>
    </section>
  );
}

function HouseInfoItem({ img, text }) {
  return (
    <div>
      <Image src={img} width={25} height={25} alt="Icon" />
      <p>{text}</p>
    </div>
  );
}

function HouseTags({ house_id }) {
  const [tags, setTags] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const [cookies, setCookies, removeCookies] = useCookies();
  const router = useRouter();

  useEffect(() => {
    async function getTags() {
      const result = await get("/houses/tags/" + house_id);

      if (result) {
        if (result.empty) {
          setTags(undefined);
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
                  // Dont touch. It looks bad, but it works
                  onClick={(e) => {
                    setCookies("searchQuery", t, { path: "/" });
                    router.replace(
                      "/houses/sewa",
                      "./houses/" + cookies.lastPage ? cookies.lastPage : "sewa"
                    );
                  }}
                >
                  {t}
                </p>
              );
            })
          ) : (
            <p>No Tags Found</p>
          )}
        </div>
      )}
    </div>
  );
}

function EditPanel({ house_id }) {
  const router = useRouter();

  return (
    <Image
      onClick={(e) => {
        router.push("/edit/" + house_id);
      }}
      src={EditIcon}
      width={60}
      height={60}
      className="edit-btn svg-primary hover scale"
    />
  );
}
