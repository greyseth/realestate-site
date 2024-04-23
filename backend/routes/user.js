const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const connection = require("../db");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./resources/uploads/avatar");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, "avatar_" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  connection.query(
    "SELECT first_name, last_name, email, phone, avatar FROM users",
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json(rows);
    }
  );
});

router.post("/signup", async (req, res) => {
  const content = req.body;
  if (
    !content.first_name ||
    !content.last_name ||
    !content.email ||
    !content.password ||
    !content.phone
  )
    return res.status(400).json({ error: "Missing one or more parameters" });

  //Checks if account exists
  connection.query(
    `SELECT * FROM users WHERE email = '${content.email}'`,
    (err, rows, fields) => {
      if (err) return res.status(500).json(err);
      if (rows.length > 0)
        return res
          .status(409)
          .json({ error: `User with email ${content.email} already exists` });
    }
  );

  //Generates random login token
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let newLoginToken = "";
  for (let i = 0; i < 10; i++) {
    newLoginToken += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  //Inserts data into db
  connection.query(
    `INSERT INTO users (first_name, last_name, email, phone, password, login_token) 
  VALUES ('${content.first_name}', '${content.last_name}', '${content.email}', '${content.phone}', '${content.password}', '${newLoginToken}')`,
    (err, rows, fields) => {
      if (err) return res.status(500).json(err);

      res
        .status(200)
        .json({
          success: true,
          login_id: rows.insertId,
          login_token: newLoginToken,
        });
    }
  );
});

router.post("/cookielogin", async (req, res) => {
  const content = req.body;
  if (!content.user_id || !content.login_token)
    return res.status(400).json({ error: "Missing one or more parameters" });

  connection.query(
    `SELECT * FROM users WHERE user_id = ${content.user_id} AND login_token = ${content.login_token}`,
    (err, rows, fields) => {
      if (err) return res.status(500).json(err);

      if (rows.length > 0)
        return res.status(200).json({ success: true, data: rows[0] });
      else return res.status(409).json({ err: "Account data not found" });
    }
  );
});

router.post("/login", async (req, res) => {
  const content = req.body;
  if (!content.email || !content.password)
    return res.status(400).json({ error: "Missing one or more parameters" });

  connection.query(
    `SELECT * FROM users WHERE email = '${content.email}' AND password = '${content.password}'`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0)
        return res.status(200).json({ success: true, data: rows[0] });
      else return res.status(200).json({ invalid: true });
    }
  );
});

router.post("/id/:user_id", async (req, res) => {
  const content = req.body;

  connection.query(
    `SELECT first_name, last_name, email, phone, avatar, login_token FROM users WHERE user_id = ${req.params.user_id}`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0)
        return res.status(200).json({
          ...rows[0],
          self: content.login_token === rows[0].login_token,
        });
      else
        return res
          .status(404)
          .json({ error: "User with id " + req.params.user_id + " not found" });
    }
  );
});

router.post("/update/:user_id", async (req, res) => {
  const content = req.body;
  if (!content) return res.status(400).json({ error: "Nothing to update" });

  //Shitty method
  if (content.first_name) {
    connection.query(
      `UPDATE users SET first_name = '${content.first_name}' WHERE user_id = ${req.params.user_id};`,
      (err, rows, fields) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json({ success: true });
      }
    );
  } else if (content.last_name) {
    connection.query(
      `UPDATE users SET last_name = '${content.last_name}' WHERE user_id = ${req.params.user_id};`,
      (err, rows, fields) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json({ success: true });
      }
    );
  } else if (content.phone) {
    connection.query(
      `UPDATE users SET phone = '${content.phone}' WHERE user_id = ${req.params.user_id};`,
      (err, rows, fields) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json({ success: true });
      }
    );
  }
});

router.post(
  "/uploadavatar",
  upload.single("image_upload"),
  async (req, res) => {
    const content = req.body;
    if (!content.user_id)
      return res.status({ error: "Missing user_id parameter" });

    console.log(req.file.filename);
    if (!req.file) return res.status(400).json({ error: "No file found" });
    connection.query(
      `UPDATE users SET avatar = '${req.file.filename}' WHERE user_id = ${content.user_id}`,
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err.message });
        else
          return res
            .status(200)
            .json({ success: true, image: req.file.filename });
      }
    );
  }
);

// router.post(
//   "/uploadavatar",
//   upload.single("avatar_upload"),
//   async (req, res) => {
//     console.log(req.file);
//     res.send("Uploaded file");
//   }
// );

router.get("/avatar/:filename", async (req, res) => {
  res.sendFile(
    path.resolve(
      __dirname + "/../resources/uploads/avatar/" + req.params.filename
    )
  );
});

module.exports = router;
