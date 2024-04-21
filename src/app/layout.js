import { Inter } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./assets/css/presets.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CookiesProvider } from "react-cookie";

const inter = Inter({ subsets: ["latin"] });
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--dmsans",
});

export const metadata = {
  title: "SerasiHunian",
  description: "Tugas Kelompok PKWH",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
