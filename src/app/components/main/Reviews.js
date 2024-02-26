import StarFull from "../../assets/img/icons/star_full.svg";
import StarHalf from "../../assets/img/icons/star_half.svg";
import StarNone from "../../assets/img/icons/star_none.svg";
import Quote from "../../assets/img/icons/quote.svg";
import Majima from "../../assets/img/majima.jpeg";

import { useEffect, useState } from "react";
import Image from "next/image";

// stars 1 = full, stars .5 = half star, star 0 = no star
const reviews = [
  {
    picture: Majima,
    author: "Dzakwa Alrafi Hansya",
    content:
      "Saya sangat puas dengan pengalaman menggunakan jasa mereka. Situs webnya intuitif dan mudah digunakan, memudahkan saya untuk menemukan properti yang sesuai dengan kebutuhan saya",
    stars: [1, 1, 1, 1, 0.5],
    size: "full",
  },
  {
    picture: "",
    author: "Hafidz Syahputra",
    content:
      "Memberikan informasi yang jelas dan akurat tentang properti yang tersedia. Membuat saya merasa percaya dan nyaman",
    stars: [1, 1, 1, 1, 0],
    size: "half",
  },
  {
    author: "Hafidz Syahputra",
    picture: "",
    content:
      "Memberikan informasi yang jelas dan akurat tentang properti yang tersedia. Membuat saya merasa percaya dan nyaman",
    stars: [1, 1, 1, 1, 0],
    size: "half",
  },
  {
    picture: "",
    author: "Dzakwa Alrafi Hansya",
    content:
      "Saya sangat puas dengan pengalaman menggunakan jasa mereka. Situs webnya intuitif dan mudah digunakan, memudahkan saya untuk menemukan properti yang sesuai dengan kebutuhan saya",
    stars: [1, 1, 1, 1, 0.5],
    size: "full",
  },
];

const rs = [];
function initReviews() {
  for (let i = 0; i < reviews.length; i += 2) {
    rs.push([reviews[i], reviews[i + 1]]);
  }
}
initReviews();

export default function Reviews() {
  return (
    <div className="reviews-container">
      {rs.map((rr, i) => {
        return <ReviewRow key={i} rr={rr} />;
      })}
    </div>
  );
}

function ReviewRow({ rr }) {
  return (
    <div
      className="review-row"
      style={{
        display: "grid",
        gridTemplateColumns: `${rr[0].size === "full" ? "1fr" : "35%"} ${
          rr[1].size === "full" ? "1fr" : "35%"
        }`,
      }}
    >
      {rr.map((r, i) => {
        return <Review key={i} r={r} />;
      })}
    </div>
  );
}

function Review({ r }) {
  return (
    <div className="review">
      <div className="pic-container">
        {r.picture ? (
          <Image src={r.picture} alt="reviewer image" className="pic" />
        ) : (
          <div className="review-nopic"></div>
        )}
      </div>
      <div className="content-container">
        <p className="content">{r.content}</p>
        <p className="author">{r.author}</p>
      </div>
      <div className="misc">
        <div className="stars-container">
          {r.stars.map((star, i) => {
            return (
              <Image
                key={i}
                src={star === 1 ? StarFull : star === 0.5 ? StarHalf : StarNone}
                alt="star"
              />
            );
          })}
        </div>
        <Image src={Quote} alt="quote icon" />
      </div>
    </div>
  );
}
