// import Users from "../models/UserModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Siswa from "../models/SiswaModel.js";
import Users from "../models/UserModel.js";
import Presensi from "../models/PresensiModel.js";

// >>> CREATE NEW SISWA
export const createSiswa = async (req, res) => {
  const {
    nama_lengkap,
    tempat_lahir,
    tanggal_lahir,
    gender,
    nama_ayah,
    nama_ibu,
    alamat,
    kelompok,
    desa,
    daerah,
    no_telp,
  } = req.body;
  if (req.alldata.role === "admin") {
    try {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = req.body.nama_lengkap + ext;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
          await Siswa.create({
            nama_lengkap: nama_lengkap,
            tanggal_lahir: tanggal_lahir,
            tempat_lahir: tempat_lahir,
            nama_ayah: nama_ayah,
            nama_ibu: nama_ibu,
            gender: gender,
            kelompok: kelompok,
            desa: desa,
            daerah: daerah,
            alamat: alamat,
            no_telp: no_telp,
            foto: fileName,
          });
          res.status(201).json({ msg: "Siswa Created Successfuly" });
        } catch (error) {
          console.log(error.message);
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "Akses terlarang" });
  }
};

// >>> GET ALL SISWA
export const getSiswa = async (req, res) => {
  try {
    const response = await Siswa.findAll({
      //   attributes: ["id", "nama_lengkap", "kelompok", "gender"],
    });
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

// >>> GET SPECIFIC SISWA
export const getSpecificSiswa = async (req, res) => {
  try {
    const response = await Siswa.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

// >>> UPDATE SPECIFIC SISWA
export const updateSiswa = async (req, res) => {
  if (req.alldata.role !== "admin") {
    return res.status(403).json({ msg: "Forbidden Bro" });
  }
  const {
    nama_lengkap,
    tanggal_lahir,
    tempat_lahir,
    gender,
    nama_ayah,
    nama_ibu,
    alamat,
    kelompok,
    desa,
    daerah,
    no_telp,
  } = req.body;
  try {
    const response = await Siswa.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    let fileName = "";
    if (req.files === null) {
      fileName = response.foto;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = req.body.nama_lengkap + ext;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

      try {
        const filepath = `./public/images/${response.foto}`;
        fs.unlinkSync(filepath);
      } catch (error) {
        console.log(error);
      }

      file.mv(`./public/images/${fileName}`, async (err) => {
        await Siswa.update(
          {
            foto: fileName,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    try {
      await Siswa.update(
        {
          nama_lengkap: nama_lengkap,
          tanggal_lahir: tanggal_lahir,
          tempat_lahir: tempat_lahir,
          gender: gender,
          nama_ayah: nama_ayah,
          nama_ibu: nama_ibu,
          alamat: alamat,
          kelompok: kelompok,
          desa: desa,
          daerah: daerah,
          no_telp: no_telp,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// >>> HAPUS SISWA
export const deleteSiswa = async (req, res) => {
  try {
    const response = await Siswa.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    await Siswa.destroy({
      where: {
        id: req.params.id,
      },
    });
    try {
      const filepath = `./public/images/${response.foto}`;
      fs.unlinkSync(filepath);
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ msg: "Siswa deleted successfuly" });
  } catch (error) {}
};

// >>> ATTENDANCE API OLD
// export const attendance = async (req, res) => {
//   try {
//     console.log('=== ATTENDANCE REQUEST ===');
//     console.log('Body:', req.body);
//     console.log('Files:', req.files);
//     // console.log('android id :', req.body.android_id);

//     const userId = await Users.findOne({
//       where: {
//         email: req.body.email,
//       },
//     });
//     // Check if photo exists
//     if (!req.files || !req.files.photo) {
//       return res.status(400).json({
//         success: false,
//         message: "No photo uploaded"
//       });
//     }

//     const file = req.files.photo; // 'photo' matches the field name from Flutter
//     const fileSize = file.data.length;
//     const ext = path.extname(file.name);
//     const { name } = req.body;

//     // Get Indonesia time (UTC+7)
//     const now = new Date();
//     const indonesiaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
//     const humanReadableTimestamp = indonesiaTime.toISOString().slice(0, 19).replace('T', ' ').replace(/:/g, '-');
//     const fileName = `${name} ${humanReadableTimestamp}.jpg`;
//     const allowedType = [".png", ".jpg", ".jpeg"];

//     // Validate file type
//     if (!allowedType.includes(ext.toLowerCase())) {
//       return res.status(422).json({
//         success: false,
//         message: "Invalid image format. Only PNG, JPG, JPEG allowed"
//       });
//     }

//     // Validate file size (5MB)
//     if (fileSize > 5000000) {
//       return res.status(422).json({
//         success: false,
//         message: "Image must be less than 5 MB"
//       });
//     }

//     // Create directory if it doesn't exist
//     const uploadDir = process.env.ATTENDANCE_UPLOAD_DIR;
//     console.log('Upload directory:', uploadDir);

//     try {
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//         console.log('Directory created:', uploadDir);
//       }
//     } catch (mkdirErr) {
//       console.log('Error creating directory:', mkdirErr);
//       return res.status(500).json({
//         success: false,
//         message: `Failed to create upload directory: ${mkdirErr.message}`
//       });
//     }

//     // Normalize path for both Windows and Linux
//     const filePath = path.join(uploadDir, fileName);
//     console.log('Full file path:', filePath);

//     // Save the file
//     file.mv(filePath, async (err) => {
//       if (err) {
//         console.log('Error saving file:', err);
//         console.log('Attempted path:', filePath);
//         return res.status(500).json({
//           success: false,
//           message: err.message
//         });
//       }

//       try {
//         // Get form data
//         const { email, name, latitude, longitude, accuracy } = req.body;

//         // Use Indonesia time (UTC+7) for database timestamp
//         const now = new Date();
//         const indonesiaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
//         const formattedTimestamp = indonesiaTime.toISOString().slice(0, 19).replace('T', ' ').replace(/:/g, '-');
//         const photoFileName = `${name} ${formattedTimestamp}.jpg`;

//         console.log('Photo saved:', photoFileName);
//         console.log('Attendance data:', {
//           email,
//           name,
//           formattedTimestamp,
//           latitude,
//           longitude,
//           accuracy
//         });

//         // Here you can save to database
//         await Presensi.create({
//           id_user: userId.id,
//           caption: req.body.caption,
//           email,
//           name,
//           timestamp: formattedTimestamp,
//           latitude: parseFloat(latitude),
//           longitude: parseFloat(longitude),
//           accuracy: parseFloat(accuracy),
//           photo: photoFileName
//         });

//         return res.status(200).json({
//           success: true,
//           message: "Attendance registered successfully!",
//           data: {
//             email,
//             name,
//             timestamp: formattedTimestamp,
//             location: { latitude, longitude, accuracy },
//             photo: photoFileName
//           }
//         });
//       } catch (error) {
//         console.log('Error processing attendance:', error);
//         return res.status(500).json({
//           success: false,
//           message: error.message
//         });
//       }
//     });

//   } catch (error) {
//     console.log('Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// >>> ATTENDANCE API
export const attendance = async (req, res) => {
  try {
    console.log("=== ATTENDANCE REQUEST ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const {
      email,
      name,
      latitude,
      longitude,
      accuracy,
      caption,
      selectedOption,
    } = req.body;

    // Find user
    const user = await Users.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check photo
    if (!req.files || !req.files.photo) {
      return res.status(400).json({
        success: false,
        message: "No photo uploaded",
      });
    }

    const file = req.files.photo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name).toLowerCase();
    const allowedType = [".png", ".jpg", ".jpeg"];

    // Validate type
    if (!allowedType.includes(ext)) {
      return res.status(422).json({
        success: false,
        message: "Invalid image format. Only PNG, JPG, JPEG allowed",
      });
    }

    // Validate size (5MB)
    if (fileSize > 5_000_000) {
      return res.status(422).json({
        success: false,
        message: "Image must be less than 5 MB",
      });
    }

    // Generate timestamp ONCE
    const now = new Date();
    const indonesiaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const timestamp = indonesiaTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
      .replace(/:/g, "-");

    const fileName = `${name} ${timestamp}.jpg`;

    // Ensure upload directory exists
    const uploadDir = process.env.ATTENDANCE_UPLOAD_DIR;

    if (!uploadDir) {
      return res.status(500).json({
        success: false,
        message: "Upload directory not configured",
      });
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    console.log("Saving file to:", filePath);

    // Save file
    file.mv(filePath, async (err) => {
      if (err) {
        console.log("File save error:", err);
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      try {
        // Save attendance record
        await Presensi.create({
          id_user: user.id,
          caption,
          email,
          name,
          timestamp,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          accuracy: parseFloat(accuracy),
          photo: fileName,
          job_type: selectedOption || null,
        });

        return res.status(200).json({
          success: true,
          message: "Attendance registered successfully!",
          data: {
            email,
            name,
            timestamp,
            location: {
              latitude,
              longitude,
              accuracy,
            },
            photo: fileName,
          },
        });
      } catch (dbError) {
        console.log("Database error:", dbError);

        // Optional rollback: remove file if DB insert fails
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(500).json({
          success: false,
          message: dbError.message,
        });
      }
    });
  } catch (error) {
    console.log("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// >>> GET SPECIFIC ATTENDANCE BY EMAIL
export const getSpecificAttendance = async (req, res) => {
  try {
    // const usernya = await Users.findOne({
    //   where: {
    //     email: req.params.id,
    //   },
    // });
    console.log("Fetching attendance for email:", req.params.id);
    const the_user = await Users.findOne({
      where: {
        email: req.params.id,
      },
    });
    const response = await Presensi.findAll({
      where: {
        id_user: the_user.id,
      },
    });

    console.log("Attendance records found:", the_user.id);

    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json(error);
  }
};
