import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// ----------------------------------------------------------
//                  === AUTH MANAGAMENET ===
// ----------------------------------------------------------

// // >>> REGISTER NEW USER
// export const RegisterUser = async (req, res) => {
//   const { name, email, password, confPassword } = req.body;
//   if (password !== confPassword)
//     return res.status(400).json("password are not match!");
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(password, salt);
//   try {
//     await Users.create({
//       name: name,
//       password: hashedPassword,
//       email: email,
//       role: "user",
//     });
//     return res.status(200).json("register success !");
//   } catch (error) {
//     console.log(error);
//   }
// };

// >>> REGISTER NEW USER
export const RegisterUser = async (req, res) => {
  const { name, email, password, confPassword, nik } = req.body;

  // 1. Check password match
  if (password !== confPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // 2. Check if email OR NIK already exists
    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ email: email }, { nik: nik }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already registered" });
      }
      if (existingUser.nik === nik) {
        return res.status(409).json({ message: "NIK already registered" });
      }
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    await Users.create({
      name,
      email,
      password: hashedPassword,
      nik,
      role: "user",
    });

    return res.status(201).json({ message: "Register success!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// >>> LOGIN USER
export const LoginUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    console.log("android id :", req.body);
    if (user.length > 0) {
      const match = await bcrypt.compare(req.body.password, user[0].password);
      if (!match) return res.status(400).json("email or password is wrong!");
      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const role = user[0].role;
      const nik = user[0].nik;
      const status = user[0].status;
      const department = user[0].department;
      const accessToken = jwt.sign(
        { userId, name, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "60s",
        }
      );
      const refreshToken = jwt.sign(
        { userId, name, email, role },
        process.env.REFRESH_TOKEN_SECRET,
        {
          // expiresIn: "1d",
          expiresIn: "300s",
        }
      );
      await Users.update(
        { refresh_token: refreshToken },
        {
          where: {
            id: userId,
          },
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        //   secure:true
      });
      res.json({
        success: true,
        accessToken,
        refreshToken,
        user: { name: name, email: email, role: role, nik: nik, status: status, department: department },
      });
    }
    // return res.send("ada usersnya");
    else return res.status(404).json("email or password is wrong!");
  } catch (error) {
    return res.status(400).json(error);
  }
};

// // >>> LOGOUT USER
// export const LogoutUser = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.sendStatus(204);
//   const user = await Users.findAll({
//     where: {
//       refresh_token: refreshToken,
//     },
//   });
//   if (!user[0]) return res.sendStatus(403);
//   const userId = user[0].id;
//   await Users.update(
//     {
//       refresh_token: null,
//     },
//     {
//       where: {
//         id: userId,
//       },
//     }
//   );
//   res.clearCookie("refreshToken");
//   return res.status(200).json("success logout!");
// };

// >>> LOGOUT USER
export const LogoutUser = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(403);
  const userId = user[0].id;
  await Users.update(
    {
      refresh_token: null,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).json("success logout!");
};

// // >>> TEST API FOR ATTENDANCE
// export const attendance = async (req, res) => {
//   try {
//     console.log(req.body)
//     return res.status(200).json("register success !");
//   } catch (error) {
//     console.log(error);
//   }
// };
