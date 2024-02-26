import Image from "next/image";

import NetworkBG from "../../assets/img/property_network.svg";
import LocationIcon from "../../assets/img/icons/location_indicator.svg";
import { useEffect } from "react";

//TODO: Change these values to percents instead of pixels
const locations = [
  { x: 500, y: 500, name: "Place 1" },
  { x: 850, y: 450, name: "Place 2" },
  { x: 300, y: 480, name: "Place 3" },
  { x: 900, y: 500, name: "Place 4" },
  { x: 550, y: 350, name: "Place 5" },
  { x: 750, y: 700, name: "Place 6" },
  { x: 1050, y: 750, name: "Place 7" },
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
      style={{ left: pos.x, top: pos.y }}
      className="location-icon"
      alt="location pointer"
      id={pos.name}
    />
  );
}
