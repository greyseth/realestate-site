"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

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

  const [cookies, setCookies, removeCookies] = useCookies();
  const router = useRouter();

  return (
    <footer>
      <div className="footer-container">
        <div>
          <p>Tertarik Untuk Mulai Bersama Kami?</p>
          {/* TODO: Change this placeholder text */}
          {/* Can't because the designers didn't fuckig put anything here */}
          <p style={{ width: "90%", textWrap: "wrap" }}>
            Wow breaking the law breaking the world kowase kirisake tenderness
            wow breaking the rule roppou zenshou ga shiba renai
          </p>
          <button
            className="primary-btn hover scale to-white-bg to-tertiary-fg"
            style={{ padding: "1em", borderRadius: "10px" }}
            onClick={(e) => {
              if (!cookies.login) router.push("/auth/login");
              else router.push("/houses/new");
            }}
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
