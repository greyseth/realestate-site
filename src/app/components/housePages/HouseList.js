"use client";

import { useEffect, useState } from "react";
import { get, post } from "../../API/API";
import "../../assets/css/houses.css";

import SearchIcon from "../../assets/img/icons/search.svg";
// import DropdownIcon from "../../assets/img/icons/dropdown_icon.svg";
// import DateCreatedIcon from "../../assets/img/icons/refresh.svg";
// import MajimaChan from "../../assets/img/majima.jpeg";
// import WhatsappIcon from "../../assets/img/icons/whatsapp.svg";

import Loading from "../Loading";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HouseItem from "./HouseItem";
import Message from "../Message";

export default function HouseList({ listing }) {
  const [houseData, setHouseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState(undefined);

  const router = useRouter();

  async function getHouseList() {
    const request = await get("/houses/" + listing);
    if (request.error) {
      setMessage({
        type: "error",
        message: "Sebuah error telah terjadi ketika mengambil data",
        buttons: [
          { display: "Ulangi", action: getHouseList() },
          {
            display: "Kembali",
            action: function () {
              router.push("/");
            },
          },
          {
            display: "Tutup",
            action: () => {
              setMessage(undefined);
            },
          },
        ],
      });
      console.log(request.error);
      return;
    }

    if (request.empty) {
      setMessage({
        type: "notice",
        message: `Data tidak ditemukan ¯\_(ツ)_/¯`,
        buttons: [
          { display: "Ulangi", action: getHouseList() },
          {
            display: "Kembali",
            action: function () {
              router.push("/");
            },
          },
          {
            display: "Tutup",
            action: () => {
              setMessage(undefined);
            },
          },
        ],
      });

      return;
    }

    setHouseData(request);

    setIsLoading(false);
  }

  useEffect(() => {
    getHouseList();
    // fetch("http://localhost:3001/houses/sewa")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setHouseData(data);
    //     console.log(houseData);
    //   });
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

      <Header type={listing} isLoading={isLoading} />
      {isLoading ? (
        <div className="loading-container">
          <Loading width={"10%"} height={"auto"} />
        </div>
      ) : (
        <section style={{ width: "100%" }}>
          <div className="listing-header">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Cari berdasarkan lokasi, keyword, atau area yang ingin kamu huni"
              />
              <Image
                src={SearchIcon}
                width={50}
                height={50}
                className="hover scale"
                alt="search icon"
              />
            </div>

            <select className="dropdown secondary-btn hover to-tertiary-bg to-secondary-fg">
              <option value={"unfiltered"}>Urutkan</option>
              <option value={"price-lh"}>Harga (rendah-tinggi)</option>
              <option value={"price-hl"}>Harga (tinggi-rendah)</option>
              <option value={"date-new"}>Tanggal (baru)</option>
              <option value={"date-old"}>Tanggal (lama)</option>
            </select>
          </div>

          <div className="listing-separator-container">
            <div></div>
          </div>

          <MainContent listing={listing} houseData={houseData} />
        </section>
      )}
    </>
  );
}

function MainContent({ listing, locations, types, houseData }) {
  return (
    <section className="main-content">
      <aside>
        <h2>Filter Lokasi</h2>
        <ul>
          <li>Rumah di{listing} di Surabaya</li>
          <li>Rumah di{listing} di Surabaya</li>
          <li>Rumah di{listing} di Surabaya</li>
        </ul>

        <h2>Filter Tipe</h2>
        <ul>
          <li>Townhouse</li>
          <li>Rumah Subsidi</li>
          <li>Rumah Kosan</li>
        </ul>
      </aside>

      <ul className="house-list">
        {houseData.map((house, i) => {
          return <HouseItem key={i} house={house} />;
        })}
      </ul>
    </section>
  );
}

function Header({ listing, queryAmount, isLoading }) {
  return (
    <div className="listing-title">
      <h1>{listing === "jual" ? "Rumah Dijual" : "Sewa Rumah Kontrakan"}</h1>
      <p>{isLoading ? "Memuat..." : "999,999,999 Rumah ditemukan"}</p>

      {isLoading ? <div className="listing-separator"></div> : null}
    </div>
  );
}
