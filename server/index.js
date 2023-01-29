import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import jwt, { verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
config();
const app = express();

import User from "./Models/User.js";
import Supplier from "./Models/Supplier.js";
import Employee from "./Models/Employee.js";

app.use(express.json());
app.use(cors());

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  if (!token) return res.status(401).json();

  try {
    var payload = verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json();
  }
};

app.post("/api/add-user", async (req, res) => {
  try {
    const { username, password, confirm_password } = req.body;
    if (await User.findOne({ username })) {
      return res
        .status(400)
        .send({ error: "Unijeli ste vec koristeno korisnicko ime!" });
    }
    if (password.length < 8) {
      return res.status(400).send({ error: "Prekratka lozinka" });
    }
    if (password !== confirm_password) {
      return res.status(400).send({ error: "Lozinke se ne poklapaju" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "admin",
    });
    await newUser.save();
    res.send({ success: "Korisnik Kreiran!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/check-user", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).populate("employee_id");
    if (!user) {
      return res.status(401).send({ error: "Netacno korisnicko ime!" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ error: "Lozinka nije ispravna!" });
    }
    if (
      user.role === "employee" &&
      user.employee_id.dateOfCancellation !== null &&
      user.employee_id.dateOfCancellation !== undefined
    ) {
      return res.status(401).send({ error: "Niste vise zaposleni!" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/api/change-user", async (req, res) => {
  try {
    const { _id, oldPassword, newPassword, repeatPassword } = req.body;
    const user = await User.findById(_id);
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).send({ error: "Netacna lozinka" });
    }
    if (oldPassword === newPassword) {
      return res.status(400).send({ error: "Unijeli ste istu lozinku" });
    }
    if (newPassword !== repeatPassword) {
      return res.status(400).send({ error: "Lozinke se ne poklapaju" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(_id, {
      password: hashedPassword,
    });
    res.send({ message: "Lozinka uspjesno promijenjena" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/api/employee/add", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      telephone,
      address,
      email,
      username,
      password,
      dateOfEmployment,
    } = req.body;
    const employee = await Employee.create({
      firstName,
      lastName,
      telephone,
      address,
      email,
      dateOfEmployment,
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      employee_id: employee._id,
      username,
      password: hashedPassword,
      role: "employee",
    });
    res.send({ message: "Korisnik i Zaposlenik dodati!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/employee/get", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/api/employee/update", async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    await Employee.findOneAndUpdate({ _id }, { $set: updateData });
    res.send({ message: "Azurirane informacije zaposlenika" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/supplier/get-suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.send(suppliers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/api/supplier/add-supplier", async (req, res) => {
  try {
    const supplier = req.body;
    await Supplier.create(supplier);
    res.send({ message: "Dobavljac uspjesno dodat!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/api/supplier/update", async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    await Supplier.findOneAndUpdate({ _id }, { $set: updateData });
    res.send({ message: "Azurirane informacije dobavljaca!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("employee_id");
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

mongoose.set("strictQuery", false);
connect(process.env.MONGODB_URL, { useNewUrlParser: true }).then(() => {
  console.log("Server started");
  app.listen(5000);
});
