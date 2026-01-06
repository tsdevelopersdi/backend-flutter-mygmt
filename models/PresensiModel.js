import { Sequelize } from "sequelize";
import DB from "../config/Database.js";
import Siswa from "./SiswaModel.js";
import MuridKelas from "./MuridKelasModel.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const Presensi = DB.define(
  "presensi",
  {
    id_kelas: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    id_siswa: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    tanggal: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    foto: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    timestamp: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    latitude: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    longitude: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    accuracy: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    id_user: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    caption: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    job_type: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

// Siswa.hasMany(Presensi);
// Presensi.belongsTo(Siswa);
// Kelas.hasMany(Presensi);
// Presensi.belongsTo(Kelas);

export default Presensi;
