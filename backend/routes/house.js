const express = require("express");
const router = express.Router();
const multer = require("multer");
const connection = require("../db");
const path = require("path");
const { existsSync } = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./resources/uploads/house");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, "img_" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });

router.post("/tempimage", upload.single("image_upload"), async (req, res) => {
  res.status(200).json({ success: true, image: req.file.filename });
});

router.post("/uploadimage", upload.single("image_upload"), async (req, res) => {
  const content = req.body;
  if (!content.house_id || !content.thumbnail)
    return res.status({ error: "Missing one or more required parameters" });

  console.log(req.file.filename);
  connection.query(
    `INSERT INTO images (house_id, name, thumbnail) VALUES (${content.house_id}, '${req.file.filename}', ${content.thumbnail})`
  );

  res.status(200).json({ success: true, image: req.file.filename });
});

router.post("/new", async (req, res) => {
  const content = req.body;
  if (
    !content.user_id ||
    !content.name ||
    !content.city ||
    !content.type ||
    !content.room_count ||
    !content.bathroom_count ||
    !content.electricity ||
    !content.land_area ||
    !content.building_area ||
    !content.certificate ||
    !content.listing ||
    !content.price
  )
    return res.status(400).json({ error: "Missing one or more parameters" });

  let house_id = 0;

  const date = new Date();
  connection.query(
    `INSERT INTO houses(user_id, name, type, city, room_count, bathroom_count, electricity, land_area, building_area, certificate, listing, price, last_modified) VALUES (${
      content.user_id
    }, "${content.name}", '${content.type}', '${content.city}', ${
      content.room_count
    }, ${content.bathroom_count}, ${content.electricity}, ${
      content.land_area
    }, ${content.building_area}, '${content.certificate}', '${
      content.listing
    }', ${content.price}, '${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}')`,
    (err, rows, fields) => {
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        house_id = rows.insertId;
        return res.status(200).json({ success: true, house_id: house_id });
      }
    }
  );
});

router.post("/newimages", async (req, res) => {
  const content = req.body;
  if (!content.house_id || !content.thumbnail)
    return res
      .status(400)
      .json({ error: "Missing one or more required parameters" });

  let photosQuery = "INSERT INTO images(house_id, name, thumbnail) VALUES ";
  if (content.photos) {
    content.photos.forEach((p) => {
      if (p) photosQuery += `(${content.house_id}, '${p}', 0),`;
    });
  }

  photosQuery += `(${content.house_id}, '${content.thumbnail}', 1);`;

  connection.query(photosQuery, (err, rows, fields) => {
    if (err) return res.status(500).json({ error: err });

    return res.status(200).json({ success: true });
  });
});

router.post("/newtags", async (req, res) => {
  const content = req.body;
  if (!content.house_id || !content.tags)
    return res
      .status(400)
      .json({ error: "Missing one or more required parameters" });

  let query = `INSERT INTO tags (house_id, tag) VALUES ${content.tags.map(
    (tag, index) => {
      //Apparently I don't need to manually add a comma???
      return `(${content.house_id}, '${tag}')${
        index === content.tags.length - 1 ? "" : ""
      }`;
    }
  )};`;
  connection.query(query, (err, rows, fields) => {
    if (err) return res.status(500).json({ error: err });
    return res.status(200).json({ success: true });
  });
});

router.post("/search/:listing", async (req, res) => {
  const content = req.body;

  if (
    req.params.listing.toString() !== "sewa" &&
    req.params.listing.toString() !== "jual"
  )
    return res.status(400).json({ error: "Invalid listing parameter" });

  let orderQuery = undefined;
  if (content.order) {
    switch (content.order) {
      case "price_desc":
        orderQuery = `ORDER by price DESC`;
        break;
      case "price_asc":
        orderQuery = `ORDER by price ASC`;
        break;
      case "date_desc":
        orderQuery = `ORDER by last_modified DESC`;
        break;
      case "date_asc":
        orderQuery = `ORDER by last_modified ASC`;
        break;
    }
  }

  connection.query(
    `SELECT houses.*, images.name AS thumbnail, users.first_name, users.last_name, users.avatar, users.phone, tags.tag FROM houses LEFT JOIN images ON houses.house_id = images.house_id AND images.thumbnail = 1 LEFT JOIN users ON houses.user_id = users.user_id LEFT JOIN tags ON houses.house_id = tags.house_id
    WHERE houses.listing = '${req.params.listing}' 
    ${
      content.search
        ? "AND houses.name LIKE '%" +
          content.search +
          "%' OR LOWER(houses.city) = '" +
          content.search.toLowerCase() +
          "'" +
          "OR LOWER(tags.tag) = '" +
          content.search.toLowerCase() +
          "' OR LOWER(houses.type) = '" +
          content.search.toLowerCase() +
          "'"
        : " "
    }
    GROUP BY houses.house_id ${orderQuery ?? ""}`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0)
        return res.status(200).json({ data: rows, count: rows.length });
      else return res.status(200).json({ empty: true });
    }
  );
});

router.get("/id/:house_id", async (req, res) => {
  connection.query(
    `SELECT houses.*, images.name AS thumbnail, users.first_name, users.last_name, users.avatar, users.phone FROM houses LEFT JOIN images ON houses.house_id = images.house_id LEFT JOIN users ON houses.user_id = users.user_id WHERE houses.house_id = '${req.params.house_id}' AND images.thumbnail = 1;`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0) return res.status(200).json(rows[0]);
      else return res.status(200).json({ empty: true });
    }
  );
});

router.get("/tags/:house_id", async (req, res) => {
  connection.query(
    `SELECT tag FROM tags WHERE house_id = ${req.params.house_id};`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0) {
        let returnData = [];
        rows.forEach((r) => {
          returnData.push(r.tag);
        });

        return res.status(200).json(returnData);
      } else return res.status(200).json({ empty: true });
    }
  );
});

router.get("/house_images/:house_id", async (req, res) => {
  connection.query(
    `SELECT name FROM images WHERE house_id = ${req.params.house_id} AND thumbnail = 0;`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0) return res.status(200).json(rows);
      else return res.status(200).json({ empty: true });
    }
  );
});

router.get("/thumbnail/:house_id", async (req, res) => {
  connection.query(
    `SELECT name FROM images WHERE house_id = ${req.params.house_id} AND thumbnail = 1;`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0) return res.status(200).json(rows);
      else return res.status(200).json({ empty: true });
    }
  );
});

router.post("/checkownership", async (req, res) => {
  const content = req.body;
  if (!content.checkId || !content.checkToken)
    return res
      .status(400)
      .json({ error: "Missing one or more required parameters" });

  connection.query(
    `SELECT user_id FROM users WHERE user_id = ${content.checkId} AND login_token = '${content.checkToken}'`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      else {
        if (rows.length > 0) return res.status(200).json({ owner: true });
        else return res.status(200).json({ owner: false });
      }
    }
  );
});

router.post("/delete_image/:img_id", async (req, res) => {
  connection.query(
    `DELETE FROM images WHERE img_id = ${req.params.img_id};`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      else return res.status(200).json({ success: true });
    }
  );
});

router.get("/testing", async (req, res) => {
  let houses = [];
  let users = [];

  connection.query("SELECT name FROM houses;", (err, rows, fields) => {
    if (err) console.log(err);
    houses = rows;

    connection.query("SELECT first_name FROM users;", (err, rows, fields) => {
      if (err) console.log(err);
      users = rows;
      console.log(houses);
      console.log(users);

      return res.status(200).json({ houses: houses, users: users });
    });
  });
});

router.post("/delete/:house_id", async (req, res) => {
  const content = req.body;
  if (!content.login_token)
    return res
      .status(400)
      .json({ error: "Missing required login_token parameter" });

  connection.query(
    `SELECT houses.house_id, users.login_token FROM houses
  LEFT JOIN users ON houses.user_id = users.user_id WHERE houses.house_id = ${req.params.house_id} 
  GROUP BY houses.house_id;`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      if (rows.length > 0) {
        if (rows[0].login_token === content.login_token) {
          connection.query(
            `DELETE FROM houses WHERE house_id = ${req.params.house_id};`,
            (err, rows, fields) => {
              if (err) return res.status(500).json({ error: err });
              return res.status(200).json({ success: true });
            }
          );
        } else return res.status(200).json({ error: "Unauthorized access" });
      } else return res.status(200).json({ empty: true });
    }
  );
});

router.post("/update/:house_id", async (req, res) => {
  const content = req.body;

  let imageQuery = "";
  if (content.photos) {
    imageQuery = `INSERT INTO images (house_id, name) VALUES `;
    content.photos.forEach((p, i) => {
      if (p) {
        imageQuery += `(${req.params.house_id}, '${p.name}')${
          i >= content.photos.length - 1 ? ";" : ", "
        }`;
      }
    });
  }

  let thumbnailQuery = `UPDATE houses, images SET images.name = '${content.thumbnail}'`;
  if (content.promo) thumbnailQuery += `, houses.promo = ${content.promo}`;
  thumbnailQuery += ` WHERE houses.house_id = ${req.params.house_id} AND images.house_id = ${req.params.house_id} AND images.thumbnail = 1;`;

  let tagsQuery = "";
  if (content.tags) {
    tagsQuery = `INSERT INTO tags(house_id, tag) VALUES ${content.tags.map(
      (t) => {
        return `(${req.params.house_id}, "${t}")`;
      }
    )};`;
  }

  connection.query(
    `DELETE FROM images WHERE house_id = ${req.params.house_id} AND thumbnail = 0;`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (imageQuery) {
        connection.query(imageQuery, (err, rows, fields) => {
          if (err) return res.status(500).json({ error: err });

          connection.query(thumbnailQuery, (err, rows, fields) => {
            if (err) return res.status(500).json({ error: err });
          });
        });
      } else {
        connection.query(thumbnailQuery, (err, rows, fields) => {
          if (err) return res.status(500).json({ error: err });
        });
      }

      if (content.tags) {
        connection.query(
          `DELETE FROM tags WHERE house_id = ${req.params.house_id}`,
          (err, rows, fields) => {
            if (err) return res.status(500).json({ error: err });

            connection.query(tagsQuery, (err, rows, fields) => {
              if (err) return res.status(500).json({ error: err });

              return res.status(200).json({ success: true });
            });
          }
        );
      } else {
        connection.query(
          `DELETE FROM tags WHERE house_id = ${req.params.house_id}`,
          (err, rows, fields) => {
            if (err) return res.status(500).json({ error: err });

            return res.status(200).json({ success: true });
          }
        );
      }
    }
  );
});

router.get("/user_id/:user_id", async (req, res) => {
  connection.query(
    `SELECT * FROM houses WHERE user_id = ${req.params.user_id}`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0) return res.status(200).json(rows);
      else return res.status(200).json({ empty: true });
    }
  );
});

router.post("/search", async (req, res) => {
  const content = req.body;

  let typeFilter = "";
  let cityFilter = "";
  let nameFilter = "";

  if (content.type) typeFilter = `WHERE type = '${content.type}'`;
  if (content.city) {
    if (content.type) cityFilter = `AND city = '${content.city}'`;
    else cityFilter = `WHERE city = '${content.city}'`;
  }
  if (content.name) {
    if (content.city || content.type)
      nameFilter = `AND name LIKE '%${content.name}%'`;
    else nameFilter = `WHERE name LIKE '%${content.name}%'`;
  }

  connection.query(
    `SELECT * FROM houses ${typeFilter} ${cityFilter} ${nameFilter}`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0) return res.status(200).json(rows);
      else return res.status(200).json({ empty: true });
    }
  );
});

router.get("/image/:filename", async (req, res) => {
  res.sendFile(
    path.resolve(
      __dirname + "/../resources/uploads/house/" + req.params.filename
    )
  );
});

router.get("/:listing", async (req, res) => {
  if (
    req.params.listing.toString() !== "sewa" &&
    req.params.listing.toString() !== "jual"
  )
    return res.status(400).json({ error: "Invalid listing parameter" });

  connection.query(
    `SELECT houses.*, images.name AS thumbnail, users.first_name, users.last_name, users.avatar, users.phone FROM houses LEFT JOIN images ON houses.house_id = images.house_id LEFT JOIN users ON houses.user_id = users.user_id WHERE houses.listing = '${req.params.listing}' AND images.thumbnail = 1;`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0)
        return res.status(200).json({ data: rows, count: rows.length });
      else return res.status(200).json({ empty: true });
    }
  );
});

router.post("/:listing", async (req, res) => {
  if (
    req.params.listing.toString() !== "sewa" &&
    req.params.listing.toString() !== "jual"
  )
    return res.status(400).json({ error: "Invalid listing parameter" });

  let orderQuery = undefined;
  const content = req.body;
  if (content.order) {
    switch (content.order) {
      case "price_desc":
        orderQuery = `ORDER by price DESC`;
        break;
      case "price_asc":
        orderQuery = `ORDER by price ASC`;
        break;
      case "date_desc":
        orderQuery = `ORDER by last_modified DESC`;
        break;
      case "date_asc":
        orderQuery = `ORDER by last_modified ASC`;
        break;
    }
  }

  connection.query(
    `SELECT houses.*, images.name AS thumbnail, users.first_name, users.last_name, users.avatar, users.phone FROM houses LEFT JOIN images ON houses.house_id = images.house_id LEFT JOIN users ON houses.user_id = users.user_id WHERE houses.listing = '${
      req.params.listing
    }' AND images.thumbnail = 1 ${orderQuery ?? ""}`,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });

      if (rows.length > 0)
        return res.status(200).json({ data: rows, count: rows.length });
      else return res.status(200).json({ empty: true });
    }
  );
});

module.exports = router;
