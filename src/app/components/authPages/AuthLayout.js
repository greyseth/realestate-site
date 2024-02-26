"use client";

import styles from "../../assets/css/auth.css";
import PageIllustration from "../../assets/img/auth_illustration.png";
import ShowingPasswordIcon from "../../assets/img/icons/viewpassword.svg";
import HidingPasswordIcon from "../../assets/img/icons/noviewpassword.svg";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Message from "../Message";
import { get, post } from "../../API/API";

export default function AuthLayout({ type }) {
  const [message, setMessage] = useState(undefined);

  useEffect(() => {
    console.log(message);
  }, []);

  return (
    <>
      {message ? (
        <Message
          type={message.type}
          message={message.message}
          buttons={message.buttons}
        />
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="form-illustration-container">
          <Image
            src={PageIllustration}
            alt="Never gonna give you up never gonna let you down"
          />
        </div>
        {type === "register" ? (
          <RegisterForm type={type} setMessage={setMessage} />
        ) : (
          <LoginForm type={type} setMessage={setMessage} />
        )}
      </form>
    </>
  );
}

function RegisterForm({ type, setMessage }) {
  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({ content: "", show: false });
  const [confirmPassword, setConfirmPassword] = useState({
    content: "",
    show: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      email: email,
      password: password.content,
      confirmPassword: confirmPassword.content,
    });
  }, [firstName, lastName, phone, email, password, confirmPassword]);

  async function handleSubmit() {
    //Form completion checks
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.phone ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage({
        message: "Semua field harus terisi",
        type: "error",
        buttons: [
          {
            display: "Tutup",
            action: function () {
              setMessage(undefined);
            },
          },
        ],
      });
      return;
    }

    if (formData.password != formData.confirmPassword) {
      setMessage({
        message: "Konfirmasi password tidak sesuai",
        type: "error",
        buttons: [
          {
            display: "Tutup",
            action: function () {
              setMessage(undefined);
            },
          },
        ],
      });
      return;
    }

    setIsLoading(true);

    const request = await post("/users/signup", formData);
    if (request.error || !request) {
      setMessage({
        message:
          "Sebuah kesalahan telah terjadi (buka inspect untuk melihat error)",
        type: "error",
        buttons: [
          {
            display: "Tutup",
            action: function () {
              setMessage(undefined);
            },
          },
        ],
      });
      console.log(request);
    }

    setIsLoading(false);

    //Perform login here
    console.log("logging in...");
  }

  return (
    <div className="form-item-container">
      <h2>Daftar</h2>
      <div className="form-item inline">
        <input
          type="text"
          placeholder="Nama Depan"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Nama Belakang"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </div>
      <input
        type="text"
        placeholder="Nomor HP"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
        }}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <div className="form-item inline password">
        <input
          type={password.show ? "text" : "password"}
          placeholder="Buat Password"
          value={password.content}
          onChange={(e) => {
            setPassword({ ...password, content: e.target.value });
          }}
        />
        <Image
          src={!password.show ? ShowingPasswordIcon : HidingPasswordIcon}
          alt="Toggle Password icon"
          className="svg-white hover scale"
          onClick={() => {
            setPassword({ ...password, show: !password.show });
          }}
        />
      </div>
      <div className="form-item inline password">
        <input
          type={confirmPassword.show ? "text" : "password"}
          placeholder="Konfirmasi Password"
          value={confirmPassword.content}
          onChange={(e) => {
            setConfirmPassword({ ...confirmPassword, content: e.target.value });
          }}
        />
        <Image
          src={!confirmPassword.show ? ShowingPasswordIcon : HidingPasswordIcon}
          alt="Toggle Password icon"
          className="svg-white hover scale"
          onClick={() => {
            setConfirmPassword({
              ...confirmPassword,
              show: !confirmPassword.show,
            });
          }}
        />
      </div>
      <button
        className="primary-btn hover scale to-tertiary-fg"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Mohon Menunggu..." : "Daftar"}
      </button>
      <NavNotice type={type} />
    </div>
  );
}

function LoginForm({ type, setMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({ content: "", show: false });

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);

    const request = await post("/users/login", {
      email: email,
      password: password.content,
    });

    //Perform login here
    console.log(request);

    setIsLoading(false);
  }

  return (
    <div className="form-item-container">
      <h2>Masuk</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <div className="form-item inline password">
        <input
          type={password.show ? "text" : "password"}
          placeholder="Password"
          value={password.content}
          onChange={(e) => {
            setPassword({ ...password, content: e.target.value });
          }}
        />
        <Image
          src={!password.show ? ShowingPasswordIcon : HidingPasswordIcon}
          alt="Toggle Password icon"
          className="svg-white hover scale"
          onClick={() => {
            setPassword({ ...password, show: !password.show });
          }}
        />
      </div>
      <button
        className="primary-btn hover scale to-tertiary-fg"
        disabled={isLoading}
        onClick={handleLogin}
      >
        {isLoading ? "Mohon Menunggu..." : "Masuk"}
      </button>
      <NavNotice type={type} />
    </div>
  );
}

function NavNotice({ type }) {
  return (
    <p className="nav-notice">
      {type === "register" ? "Sudah memiliki akun?" : "Belum memiliki akun?"}
      <Link
        href={type === "register" ? "/auth/login" : "/auth/register"}
        className="hover scale to-white-fg"
      >
        {type === "register" ? "Login" : "Register"}
      </Link>
    </p>
  );
}
