"use client";

import Image from "next/image";
import "../../assets/css/house_details.css";
import BackIcon from "../../assets/img/icons/back_icon.svg";
import Majimaa from "../../assets/img/majima.jpeg";
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
import { get } from "@/app/API/API";
import Loading from "@/app/components/Loading";
import Message from "@/app/components/Message";

export default function HouseDisplay({ params }) {
  const [message, setMessage] = useState(undefined);

  const [houseData, setHouseData] = useState({
    data: undefined,
    loading: true,
  });

  const router = useRouter();

  async function fetchData() {
    const result = await get("/houses/id/" + params.houseId);

    if (result.error) {
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

    setHouseData({ data: result, loading: false });
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

      <div className="page-return hover to-tertiary-fg">
        <Image src={BackIcon} />
        <p>Kembali</p>
      </div>

      {houseData.loading ? (
        <div className="loading-container">
          <Loading width={"10%"} height={"auto"} />
        </div>
      ) : (
        <HouseContent houseData={houseData} />
      )}
    </>
  );
}

function HouseContent({ houseData }) {
  return (
    <div>
      <section className="images-container">
        <div className="images">
          <Image src={Majimaa} />
          <Image src={Majimaa} />
          <Image src={Majimaa} />
          <Image src={Majimaa} />
        </div>
        <div className="thumbnail">
          <Image src={Majimaa} />
        </div>
      </section>

      <section className="info-container">
        <div className="owner-info">
          <h2>Tanya Tentang Rumah Ini</h2>
          <div className="owner-profile">
            <Image src={Majimaa} width={75} height={75} />
            <div>
              <p>Owner Name</p>
              <p>Agen Independen</p>
            </div>
          </div>

          <div className="controls">
            <button>
              <Image src={WhatsappIcon} width={25} height={25} />
              <p>WhatsApp</p>
            </button>
            <button className="hover to-white-bg to-secondary-fg">
              <Image src={PhoneIcon} width={25} height={25} />
              <p>Phone Number</p>
            </button>
          </div>
        </div>
        <div className="house-info">
          <div className="house-info-header">
            <h2>House Name Goes Here</h2>
            <p>City Location</p>
          </div>

          <div className="house-info-body">
            <h2>Informasi Properti</h2>
            <p style={{ marginBottom: "2em" }}>Spesifikasi</p>

            <div className="house-info-feats">
              <HouseInfoItem img={BedIcon} text={"Kamar Tidur: 0"} />
              <HouseInfoItem img={ToiletIcon} text={"Kamar Mandi: 0"} />
              <HouseInfoItem img={ElectricityIcon} text={"Daya Listrik: 0"} />
              <HouseInfoItem img={LuasTanahIcon} text={"Luas Tanah: 0m²"} />
              <HouseInfoItem
                img={LuasBangunanIcon}
                text={"Luas Bangunan: 0m²"}
              />
              <HouseInfoItem
                img={CertificateIcon}
                text={"Sertifikat: Sertifikat Hak Milik"}
              />
            </div>
          </div>
        </div>

        <div className="house-info-footer">
          <h2>Overview Properti</h2>
          <HouseTag tag={"Tangerang, Banten"} />
        </div>
      </section>
    </div>
  );
}

function HouseInfoItem({ img, text }) {
  return (
    <div>
      <Image src={img} width={25} height={25} />
      <p>{text}</p>
    </div>
  );
}

function HouseTag({ tag }) {
  return (
    <p
      className="secondary-btn"
      style={{ border: "none", borderRadius: "5px" }}
    >
      {tag}
    </p>
  );
}
