"use client";

import Image from "next/image";
import { useState } from "react";

import "./assets/css/main.css";

import QuickOptCards from "./components/main/QuickOptCard";

import SearchBG from "./assets/img/main_searchbg.jpg";
import SearchIcon from "./assets/img/icons/search.svg";
import QuickOptBeli from "./assets/img/quickopt_beli.png";
import QuickOptSewa from "./assets/img/quickopt_sewa.png";
import FeatsImg from "./assets/img/feats.jpg";
import NetworkLocations from "./components/main/NetworkLocations";
import CursorBox from "./components/CursorBox";
import Reviews from "./components/main/Reviews";

//Modify this static variable to add more "quick option" cards
const quickOptCards = [
  {
    img: QuickOptBeli,
    title: "Beli Rumah",
    description:
      "Temukan tempat Anda dengan pengalaman foto yang mendalam dan daftar properti terbanyak, termasuk hal-hal yang tidak akan Anda temukan di tempat lain",
    btn: "Telusuri Rumah",
    action: function (e) {
      //Button function goes here like this
    },
  },
  {
    img: QuickOptSewa,
    title: "Sewa Rumah",
    description:
      "Kami sedang menciptakan pengalaman online yang mulus mulai dari berbelanja di jaringan rental terbesar, hingga mengajukan, hingga membayar sewa.",
    btn: "Temukan Penawaran",
    action: function (e) {},
  },
];

const feats = [
  {
    big: "17K+",
    small: "Pelanggan yang puas",
  },
  {
    big: "25+",
    small: "Tahun pengalaman",
  },
  {
    big: "150+",
    small: "Pemenang penghargaan",
  },
  {
    big: "5K+",
    small: "Jumlah koleksi properti",
    bold: true,
  },
];

export default function MainPage() {
  const [cursor, setCursor] = useState({ show: false, msg: "" });

  return (
    <>
      <section className="search-container">
        <div
          className="search-bg"
          style={{
            backgroundImage: `url(${SearchBG.src})`,
            backgroundSize: "cover",
          }}
        ></div>
        <h1>Temukan Keserasian di Hunian Impian Anda</h1>
        <p>
          Serasi Hunian hadir untuk membantu Anda menemukan rumah impian Anda
          dengan mudah. Temukan keselarasan dan kenyamanan di setiap langkah
          pencarian Anda.{" "}
        </p>

        <div className="search">
          <input
            type="text"
            placeholder="Cari lokasi, keyword, atau area yang ingin kamu cari"
          />
          <button
            className="primary-btn hover scale"
            style={{ padding: "1em" }}
          >
            <Image src={SearchIcon} alt="Search Icon" />
            <p>Cari</p>
          </button>
        </div>
      </section>

      <QuickOptCards cards={quickOptCards} />

      <div className="feats-title">
        <h2>Advisor Properti Terpercaya</h2>
        <p>
          Sebuah agen properti yang terdepan yang menawarkan pengalaman yang
          mulus dan mendalam dalam mencari rumah impian Anda di pusat kota.
        </p>
      </div>
      <div className="feats-container">
        <div className="feats">
          {feats.map((feat, i) => {
            return (
              <div key={i} className={feat.bold ? "boldened" : null}>
                <p>{feat.big}</p>
                <p>{feat.small}</p>
              </div>
            );
          })}
        </div>
        <div className="feats-image">
          <Image src={FeatsImg} alt="feats image" />
        </div>
      </div>

      <NetworkLocations setCursor={setCursor} />

      <div className="reviews-title">
        <h2>Jangan percaya kami, percayalah suara mereka</h2>
        <p>
          Temukan cerita kebahagiaan dan pemenuhan hati dari klien-klien
          berharga kami saat mereka memulai perjalanan menuju rumah dan
          investasi primer mereka
        </p>
      </div>
      <Reviews />

      <CursorBox msg={cursor.msg} showing={cursor.show} />
    </>
  );
}
