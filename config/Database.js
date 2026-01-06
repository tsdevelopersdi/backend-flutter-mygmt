import { Sequelize } from "sequelize";

// const DB = new Sequelize("alkarima", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
//   timezone: "+07:00",
// });

// const DB = new Sequelize(
//   "radi8267_contoh",
//   "radi8267_contoh",
//   "ARMcortex123#",
//   {
//     host: "194.163.42.214",
//     dialect: "mysql",
//   }
// );



const DB = new Sequelize(
  "testdb",
  "postgres",
  "postgres",
  {
    host: "10.28.64.2",
    dialect: "postgres",
    port: 5434,
  }
);

export default DB;
