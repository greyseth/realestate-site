"use client";

import Image from "next/image";
import Link from "next/link";

import Logo from "../assets/img/icons/logo.svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "./Avatar.";
import { useCookies } from "react-cookie";

const navItems = [
  { display: "Sewa Rumah", url: "/houses/sewa" },
  { display: "Jual Rumah", url: "/houses/jual" },
];

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [cookies, setCookies, removeCookies] = useCookies();

  useEffect(() => {
    setLoggedIn(cookies.login);
  }, [cookies.login]);

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
      {!loggedIn ? (
        <div className="login-container">
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
      ) : (
        <div
          className="account-container"
          onClick={(e) => {
            router.push("/account/" + loggedIn.login_id);
          }}
        >
          <Avatar filename={loggedIn.avatar} />
          <p>
            {loggedIn.first_name} {loggedIn.last_name}
          </p>
        </div>
      )}
    </header>
  );
}
