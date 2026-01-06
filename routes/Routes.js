import express from "express";

// >>> IMPORT THE CONTROLLERS
import {
  // attendance,
  LoginUser,
  LogoutUser,
  RegisterUser,
} from "../controllers/AuthController.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { getUsers } from "../controllers/UserController.js";
import {
  createSiswa,
  deleteSiswa,
  getSiswa,
  getSpecificSiswa,
  updateSiswa,
  attendance,
  getSpecificAttendance
} from "../controllers/SiswaController.js";
import {
  // CheckMuridDalamKelas,
  CreateClass,
  DaftarMuridSudahKelas,
  DaftarMuridYangBelumKelas,
  MasukanMuridnya,
  getClass,
  getSpecificClass,
} from "../controllers/KelasController.js";
import {
  createNewAbsen,
  isiKehadiran,
  listPresensi,
  showAfterCreate,
} from "../controllers/PresensiController.js";
import {
  kelasIndividu,
  percentageKelas,
  statKelas,
  statPerson,
  statPersonKelas,
} from "../controllers/StatistikController.js";

// >>> DEFINE ROUTER FROM EXPRESS
const router = express.Router();

// >>> FOR AUTHENTICATION
// router.get("/token", refreshToken);
router.post("/token", refreshToken);
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.delete("/logout", LogoutUser);
router.post("/attendance", VerifyToken, attendance);
// router.post("/attendance", attendance);
router.get("/recent/:id", getSpecificAttendance);

// >>> FOR USER MANAGEMENT
router.get("/users", VerifyToken, getUsers);

// >>> FOR SISWA
router.post("/siswa", VerifyToken, createSiswa);
router.get("/siswa", getSiswa);
router.get("/siswa/:id", getSpecificSiswa);
router.patch("/siswa/:id", VerifyToken, updateSiswa);
router.delete("/siswa/:id", deleteSiswa);

// >>> FOR CLASS
router.post("/kelas", CreateClass);
router.get("/kelas", getClass);
router.get("/kelas/:id", getSpecificClass);
router.get("/muridkelas/:id", DaftarMuridYangBelumKelas);
router.get("/listmuridkelas/:id", DaftarMuridSudahKelas);
router.patch("/masukanmurid", MasukanMuridnya);
// router.post("/checkmuridkelas", CheckMuridDalamKelas);

// >>> FOR PRESENSI
router.post("/checkuntukabsen", createNewAbsen);
router.get("/showafter/:id/:datenya", showAfterCreate);
router.patch("/isipresensi", isiKehadiran);
router.get("/daftarpresensi/:id", listPresensi);

// >>> FOR STATISTIK
router.post("/statkelas", statKelas);
router.post("/statperson", statPerson);
router.post("/percentkelas", percentageKelas);
router.get("/cekkelas/:id", kelasIndividu);
router.post("/statperson/:id/:kelasnya", statPersonKelas);

export default router;
