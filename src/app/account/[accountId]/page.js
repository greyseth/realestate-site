"use client";

import Loading from "@/app/components/Loading";
import pageStyling from "../../assets/css/account.css";

import GuestIcon from "../../assets/img/icons/guest.svg";

import { useEffect, useState } from "react";
import { get, post } from "@/app/API/API";
import Message from "@/app/components/Message";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCookies } from "react-cookie";

export default function AccountPage({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(undefined);

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(undefined);
  const [isSelf, setIsSelf] = useState(false);

  const [cookies, setCookies, removeCookies] = useCookies();

  useEffect(() => {
    async function fetchData() {
      const result = await post("/users/id/" + params.accountId, {
        login_token: cookies.login.login_token,
      });

      if (result.error) {
        setMessage({
          type: "error",
          message: "Sebuah kesalahan telah terjadi...",
          buttons: [
            {
              display: "Ulangi",
              action: () => {
                fetchData();
                setMessage(undefined);
              },
            },
            {
              display: "Kembali",
              action: () => {
                router.push("/");
              },
            },
          ],
        });

        return;
      }

      setFirstName(result.first_name);
      setLastName(result.last_name);
      setPhone(result.phone);
      setAvatar(result.avatar);
      setIsSelf(result.self);

      setIsLoading(false);
    }

    fetchData();
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

      {isLoading ? (
        <div className="loading-container" style={{ marginTop: "3em" }}>
          <Loading width={"125px"} height={"auto"} />
        </div>
      ) : (
        <section className="account-page">
          <h1>
            Hello, {firstName} {lastName}
          </h1>

          <div className="account-content-container">
            <div className="account-field-container">
              <InputFieldDisplay
                isSelf={isSelf}
                header={"Nama Depan"}
                data={firstName}
                setData={setFirstName}
                userId={params.accountId}
                updateObject={{ first_name: firstName }}
                cookieUpdate={"firstName"}
              />
              <InputFieldDisplay
                isSelf={isSelf}
                header={"Nama Belakang"}
                data={lastName}
                setData={setLastName}
                userId={params.accountId}
                updateObject={{ last_name: lastName }}
                cookieUpdate={"lastName"}
              />
              <InputFieldDisplay
                isSelf={isSelf}
                header={"No Telp."}
                data={phone}
                setData={setPhone}
                userId={params.accountId}
                updateObject={{ phone: phone }}
              />
            </div>
            <div className="account-pfp">
              {avatar ? (
                <img src={"http://localhost:3001/users/avatar/" + avatar} />
              ) : (
                <Image
                  src={GuestIcon}
                  className="svg-white"
                  alt="Profile Picture"
                />
              )}
              {isSelf ? (
                <div>
                  <p>{isUploading ? "Menupload..." : "Ubah Foto"}</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="primary-btn hover to-tertiary-fg"
                    style={{ padding: "1em", borderRadius: "10px" }}
                    disabled={isUploading}
                    onChange={async (e) => {
                      setIsUploading(true);
                      let formData = new FormData();

                      formData.append("user_id", params.accountId);
                      formData.append("image_upload", e.target.files[0]);

                      const req = await fetch(
                        "http://localhost:3001/users/uploadavatar",
                        {
                          method: "POST",
                          body: formData,
                        }
                      );

                      const res = await req.json();

                      if (!res.error) {
                        setAvatar(res.image);
                        console.log(res);
                        setCookies(
                          "login",
                          {
                            ...cookies.login,
                            avatar: res.image,
                          },
                          { path: "/" }
                        );

                        setIsUploading(false);
                      } else {
                        setMessage({
                          type: "error",
                          message: "Sebuah kesalahan terjadi saat upload...",
                          buttons: [
                            {
                              display: "Tutup",
                              action: () => {
                                setMessage(undefined);
                              },
                            },
                          ],
                        });

                        console.log(res);
                        setIsUploading(false);
                      }
                    }}
                  ></input>
                </div>
              ) : null}
            </div>

            {isSelf ? (
              <div>
                <button
                  className="primary-btn hover scale to-tertiary-fg"
                  style={{ padding: "1em", borderRadius: "10px" }}
                  onClick={(e) => {
                    setCookies("login", "", { path: "/" });
                    router.push("/");
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </>
  );
}

function InputFieldDisplay({
  isSelf,
  header,
  data,
  setData,
  userId,
  updateObject,
  cookieUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  const [cookies, setCookies, removeCookies] = useCookies();

  useEffect(() => {
    async function handleUpdate() {
      setSaving(true);
      setChanged(false);

      const result = await post("/users/update/" + userId, updateObject);
      if (!result.success) {
        alert("Kesalahan terjadi saat mengupdate");
        console.log(result);
      } else {
        switch (cookieUpdate) {
          case "firstName":
            setCookies(
              "login",
              { ...cookies.login, first_name: data },
              { path: "/" }
            );
            break;
          case "lastName":
            setCookies(
              "login",
              { ...cookies.login, last_name: data },
              { path: "/" }
            );
            break;
        }
      }

      setSaving(false);
    }

    if (editing) {
      const editField = document.getElementById(`editField_${header}`);
      editField.select();
    }

    if (!editing && changed) {
      handleUpdate();
    }
  }, [editing]);

  return (
    <div className="account-field">
      <div>
        <p className="field-header">{header}</p>
        {!editing ? (
          <p className="field-display">{data}</p>
        ) : (
          <input
            id={"editField_" + header}
            value={data}
            placeholder={"Ubah " + header}
            onChange={(e) => {
              setData(e.target.value);
              setChanged(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") setEditing(!editing);
            }}
          />
        )}
      </div>
      <div>
        {isSelf ? (
          <button
            className="secondary-btn hover"
            onClick={() => setEditing(!editing)}
            disabled={saving}
          >
            {!editing ? (!saving ? "Edit" : "Meyimpan...") : "Simpan"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
