import Image from "next/image";
import GuestIcon from "../assets/img/icons/guest.svg";

export default function Avatar({ filename }) {
  return (
    <Image
      src={
        filename ? "http://localhost:3001/users/avatar/" + filename : GuestIcon
      }
      width={75}
      height={75}
      className={!filename ? "svg-white" : null}
      alt="Profile Picture"
    />
  );
}
