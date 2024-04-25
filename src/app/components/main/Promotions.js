import Image from "next/image";
import Majima from "../../assets/img/majima.jpeg";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import { get } from "@/app/API/API";
import { useRouter } from "next/navigation";

export default function Promotions() {
  const [isLoading, setIsLoading] = useState(true);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await get("/houses/discounted");
      setHouses(res);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <section>
      <h1 style={{ marginLeft: "5em" }}>Hot Deals 🔥🔥🔥🗣️🗣️</h1>
      <div
        className="promotions-container"
        style={{ justifyContent: houses.length > 3 ? "flex-start" : "center" }}
      >
        {isLoading ? (
          <CardLoading />
        ) : houses.length > 0 ? (
          houses.map((h, i) => {
            return <Card data={h} key={i} />;
          })
        ) : (
          <h2>Tidak ditemukan promo rumah :(</h2>
        )}
      </div>
    </section>
  );
}

function Card({ data }) {
  const router = useRouter();

  return (
    <div
      className="promotion-card hover"
      onClick={(e) => {
        router.push("/house/" + data.house_id);
      }}
    >
      <img
        src={"http://localhost:3001/houses/image/" + data.image}
        alt="House Image"
      />
      <div className="content">
        <p className="listing">
          {data.listing === "sewa" ? "DISEWAKAN" : "DIJUAL"}
        </p>
        <p className="name">{data.name}</p>
        <p className="new-price">
          {new Intl.NumberFormat("en-ID", {
            style: "currency",
            currency: "IDR",
          }).format(data.price - data.promo * (data.price / 100))}
          /tahun
        </p>
        <s className="price">
          {new Intl.NumberFormat("en-ID", {
            style: "currency",
            currency: "IDR",
          }).format(data.price)}
          /tahun
        </s>
        <p className="location">{data.city}</p>
      </div>
    </div>
  );
}

function CardLoading() {
  return (
    <div className="loading-container">
      <Loading width={"75px"} height={"75px"} />
    </div>
  );
}
