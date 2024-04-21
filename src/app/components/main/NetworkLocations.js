import Image from "next/image";

import NetworkBG from "../../assets/img/property_network.svg";
import LocationIcon from "../../assets/img/icons/location_indicator.svg";
import { useEffect } from "react";

const locations = [
  { x: 25, y: 50, name: "Place 1" },
  { x: 32, y: 55, name: "Place 2" },
  { x: 50, y: 75, name: "Place 3" },
  { x: 75, y: 45, name: "Place 4" },
  { x: 60, y: 50, name: "Place 5" },
  { x: 38, y: 32, name: "Place 6" },
  { x: 35, y: 75, name: "Place 7" },
];

export default function NetworkLocations({ setCursor }) {
  return (
    <div className="network-container">
      <Image src={NetworkBG} alt="map" />
      <div className="location-container">
        {locations.map((l, i) => {
          return <Location key={i} pos={l} setCursor={setCursor} />;
        })}
      </div>
    </div>
  );
}

function Location({ pos, setCursor }) {
  useEffect(() => {
    const icon = document.getElementById(pos.name);
    icon.addEventListener("mouseenter", (e) => {
      setCursor({ show: true, msg: icon.id });
    });
    icon.addEventListener("mouseleave", (e) => {
      setCursor({ show: false, msg: "" });
    });
  }, []);

  return (
    <Image
      src={LocationIcon}
      style={{ left: pos.x + "%", top: pos.y + "%" }}
      className="location-icon"
      alt="location pointer"
      id={pos.name}
    />
  );
}
