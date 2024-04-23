const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// app.post("/upload", upload.single("file_upload"), async (req, res) => {
//   console.log(req.file);
//   res.send("Uploaded file");
// });

// app.get("/file/:name", async (req, res) => {
//   res.sendFile(__dirname + "/resources/uploads/" + req.params.name);
// });

const userRouter = require("./routes/user");
const houseRouter = require("./routes/house");

app.use("/users", userRouter);
app.use("/houses", houseRouter);

app.listen(3001, () => {
  console.log("Backend server is running? Better go catch it");
});
