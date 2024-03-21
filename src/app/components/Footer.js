"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    display: "SerasiHunian",
    url: "/",
  },
  {
    display: "Email Marketing",
    url: "/marketing",
  },
  {
    display: "Jual Rumah",
    url: "/houses/jual",
  },
  {
    display: "Sewa Rumah",
    url: "/houses/sewa",
  },
  {
    display: "Iklankan Rumah",
    url: "/iklan",
  },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer>
      <div className="footer-container">
        <div>
          <p>Tertarik Untuk Mulai Bersama Kami?</p>
          <p>Dame da ne dame yo dame da no yo anta ga suki de sugi sugite</p>
          <button
            className="primary-btn hover scale to-white-bg to-tertiary-fg"
            style={{ padding: "1em", borderRadius: "10px" }}
          >
            Mulai Sekarang
          </button>
        </div>
        <ul>
          {footerLinks.map((link, i) => {
            return (
              <Link
                key={i}
                href={link.url}
                className={
                  pathname === link.url ? "hover scale selected" : "hover scale"
                }
              >
                {link.display}
              </Link>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
