"use client";

import Image from "next/image";
import Link from "next/link";

import Logo from "../assets/img/icons/logo.svg";
import { useRouter } from "next/navigation";

const navItems = [
  { display: "Sewa Rumah", url: "/sewa" },
  { display: "Jual Rumah", url: "/jual" },
];

export default function Header() {
  const router = useRouter();

  return (
    <header>
      <div
        className="site-title"
        onClick={(e) => {
          router.push("/");
        }}
      >
        <Image src={Logo} alt="Site Logo" />
        <p>SerasiHunian</p>
      </div>
      <div className="nav">
        {navItems.map((nav, i) => {
          return (
            <Link
              key={nav.url}
              className="hover scale to-white-fg"
              href={nav.url}
            >
              {nav.display}
            </Link>
          );
        })}
      </div>
      <div className="login-container">
        {/* TODO: maybe turn this into a Link component, but im too lazy to change the styling */}
        <button
          className="hover scale to-tertiary-fg"
          onClick={(e) => {
            router.push("/auth/login");
          }}
        >
          Masuk
        </button>
        <button
          className="hover scale to-white-bg to-tertiary-fg"
          onClick={(e) => {
            router.push("/auth/register");
          }}
        >
          Daftar
        </button>
      </div>
    </header>
  );
}
