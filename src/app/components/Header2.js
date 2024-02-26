import Link from "next/link";
import Logo from "../assets/img/icons/logo.svg";

import Image from "next/image";

const navItems = [
  { display: "Jual Rumah", url: "/jual" },
  { display: "Sewa Rumah", url: "/sewa" },
];

export default function Header2() {
  return (
    <header className="header2">
      <div className="site-title">
        <Image src={Logo} alt="Site Logo" />
        <p>SerasiHunian</p>
      </div>
      <div className="nav">
        {navItems.map((nav, i) => {
          return <Link href={nav.url}>{nav.display}</Link>;
        })}
      </div>
      <div className="login-container">
        <button className="hover scale to-tertiary-fg">Masuk</button>
        <button className="hover scale to-white-bg to-tertiary-fg">
          Daftar
        </button>
      </div>
    </header>
  );
}
