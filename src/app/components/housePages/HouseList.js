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
import { useCookies } from "react-cookie";

export default function HouseList({ listing }) {
  const [houseData, setHouseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [queryAmount, setQueryAmount] = useState(0);
  const [searchTemp, setSearchTemp] = useState("");
  const [search, setSearch] = useState("");
  const [searchOrder, setSearchOrder] = useState(undefined);

  const [message, setMessage] = useState(undefined);

  const router = useRouter();

  async function getHouseList() {
    setIsLoading(true);

    let request = null;
    if (!search) {
      if (!searchOrder) request = await get("/houses/" + listing);
      else request = await post("/houses/" + listing, { order: searchOrder });
    } else {
      request = await post("/houses/search/" + listing, {
        search: search,
        order: searchOrder,
      });
    }

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
          {
            display: "Ulangi",
            action: () => {
              getHouseList();
            },
          },
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

      setHouseData([]);
      setIsLoading(false);

      return;
    }

    setHouseData(request.data);
    setQueryAmount(request.count);

    setIsLoading(false);
  }

  useEffect(() => {
    setSearchTemp(search);
    getHouseList();
  }, [search, searchOrder]);

  const [cookies, setCookies, removeCookies] = useCookies();
  useEffect(() => {
    setCookies("lastPage", listing, { path: "/" });

    if (cookies.searchQuery) {
      setSearch(cookies.searchQuery);
      setCookies("searchQuery", "", { path: "/" });
    }
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

      <Header
        listing={listing}
        queryAmount={queryAmount}
        isLoading={isLoading}
      />
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
                value={searchTemp}
                onChange={(e) => {
                  setSearchTemp(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSearch(searchTemp);
                }}
              />
              <Image
                src={SearchIcon}
                width={50}
                height={50}
                className="hover scale"
                alt="search icon"
                onClick={(e) => {
                  setSearch(searchTemp);
                }}
              />
            </div>

            {/* Ascending price = lowest to highest */}
            {/* Ascending date = oldest to newest */}
            <select
              className="dropdown secondary-btn hover to-tertiary-bg to-secondary-fg"
              onChange={(e) => setSearchOrder(e.target.value)}
            >
              <option value={""}>Urutkan</option>
              <option value={"price_asc"}>Harga (rendah-tinggi)</option>
              <option value={"price_desc"}>Harga (tinggi-rendah)</option>
              <option value={"date_desc"}>Tanggal (baru)</option>
              <option value={"date_asc"}>Tanggal (lama)</option>
            </select>
          </div>

          <div className="listing-separator-container">
            <div></div>
          </div>

          <MainContent
            listing={listing}
            houseData={houseData}
            setSearch={setSearch}
          />
        </section>
      )}
    </>
  );
}

function MainContent({ listing, houseData, setSearch }) {
  const [cityFilters, setCityFilters] = useState([
    "Surabaya",
    "Semarang",
    "Jakarta",
    "Bandung",
    "City 17",
    "Kamurocho",
    "New York",
  ]);

  const [typeFilters, setTypeFilters] = useState([
    "Townhouse",
    "Rumah Subsidi",
    "Rumah Kosan",
  ]);

  return (
    <section className="main-content">
      <aside>
        <h2>Filter Lokasi</h2>
        <ul>
          {cityFilters.map((c, i) => {
            return (
              <li
                key={i}
                onClick={(e) => {
                  setSearch(c);
                }}
                className="hover to-tertiary-fg"
              >
                Rumah di{listing} di {c}
              </li>
            );
          })}
        </ul>

        <h2>Filter Tipe</h2>
        <ul>
          {typeFilters.map((t, i) => {
            return (
              <li
                key={i}
                onClick={() => setSearch(t)}
                className="hover to-tertiary-fg"
              >
                {t}
              </li>
            );
          })}
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
      <p>{isLoading ? "Memuat..." : queryAmount + " Rumah ditemukan"}</p>

      {isLoading ? <div className="listing-separator"></div> : null}
    </div>
  );
}
