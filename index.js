import express from "express";
import cors from "cors";
import fs, { read } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import hbs from "hbs";

const app = express();
const port = 1222;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data.json");
const images = path.join(__dirname, "src", "assets", "images");


if (!fs.existsSync(images)) {
  fs.mkdirSync(images, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, images),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


app.set("view engine", "hbs");
app.set("views", "./src/views");
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get("/", home);
app.get("/getin", getin);
app.get("/list-projek", listProjek);
app.get("/detail-project", detailProject);

function home(req, res) {
  res.render("index", { title: "Home" });
}

function getin(req, res) {
  res.render("getin", { title: "Add Project" });
}

function listProjek(req, res) {
  const data = readData();
  res.render("list-projek", { title: "List Projek", projects: data });
}

function detailProject(req, res) {
  res.render("detail-project", { title: "Detail Project" });
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readData() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

app.post("/add-data", upload.single("image"), (req, res) => {
  const { name, startDate, endDate, description, technology } = req.body;
  const newData = {
    id: Date.now(),
    name,
    startDate,
    endDate,
    description,
    technology: Array.isArray(technology)
      ? technology
      : technology
      ? [technology]
      : [],
    image: req.file ? `assets/images/${req.file.filename}` : null,
  };

  const data = readData();
  data.push(newData);
  saveData(data);

  res.json({ success: true, message: "Data added successfully", data: newData });
});

app.get("/get-data", (req, res) => {
  res.json(readData());
});

app.put("/edit-data/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate, description, technology } = req.body;
  let data = readData();
  const index = data.findIndex((item) => item.id == id);

  if (index === -1)
    return res.status(404).json({ success: false, message: "Data not found" });

  data[index] = {
    ...data[index],
    name: name || data[index].name,
    startDate: startDate || data[index].startDate,
    endDate: endDate || data[index].endDate,
    description: description || data[index].description,
    technology: Array.isArray(technology)
      ? technology
      : technology
      ? [technology]
      : data[index].technology,
    image: req.file ? `assets/images/${req.file.filename}` : data[index].image,
  };

  saveData(data);
  res.json({ success: true, message: "Data updated successfully", data: data[index] });
});

app.delete("/delete-data/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const newData = data.filter((item) => item.id != id);

  if (newData.length === data.length)
    return res.status(404).json({ success: false, message: "Data not found" });

  saveData(newData);
  res.json({ success: true, message: "Data deleted successfully" });
});

app.get("/detail-project/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const project = data.find((item) => item.id == id);

  if (!project)
    return res.status(404).json({ success: false, message: "Data not found" });

  res.render("detail-project", { project });
});

hbs.registerHelper("json", (context) => JSON.stringify(context, null, 2));

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
