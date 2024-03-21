import Image from "next/image";
import "../../assets/css/houses.css";
import DropdownIcon from "../../assets/img/icons/dropdown_icon.svg";
import DateCreatedIcon from "../../assets/img/icons/refresh.svg";
import MajimaChan from "../../assets/img/majima.jpeg";
import WhatsappIcon from "../../assets/img/icons/whatsapp.svg";

export default function HouseItem({ house }) {
  return (
    <li className="house-item">
      <Image
        src={"http://localhost:3001/houses/image/" + house.thumbnail}
        width={150}
        height={150}
      />
      <div>
        <div className="date-created-container">
          <Image src={DateCreatedIcon} className="svg-gray" />
          <p>Last Modified: {house.last_modified}</p>
        </div>
        {house.promo ? (
          <h2 className="price">
            <s>Rp. {house.price} / Tahun</s>
          </h2>
        ) : (
          <h2 className="price">
            {new Intl.NumberFormat("en-ID", {
              style: "currency",
              currency: "IDR",
            }).format(house.price)}{" "}
            / Tahun
          </h2>
        )}
        {house.promo ? (
          <p className="promo-price">
            {house.promo}% OFF! Rp.{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(house.price)}{" "}
            / Tahun
          </p>
        ) : null}
        <div className="name-container">
          <h3 className="name">{house.name}</h3>
          <p className="location">{house.city}</p>
        </div>

        <div className="controls">
          <button>
            <Image src={WhatsappIcon} />
            <p>WhatsApp</p>
          </button>
          <button className="hover to-white-bg to-primary-fg">
            {house.phone}
          </button>

          <div className="owner-preview">
            <div>
              <Image
                src={"http://localhost:3001/users/avatar/" + house.avatar}
                width={75}
                height={75}
              />
            </div>
            <div>
              <p>
                {house.first_name} {house.last_name}
              </p>
              <p>Agen Independen</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
