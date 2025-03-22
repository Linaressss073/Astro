import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import colors from "colors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error en MongoDB:", err));

// 📌 Esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  celular: { type: String, required: true, unique: true },
  extension: { type: String, required: false }, // Nueva extensión opcional
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// 📌 Registro de Usuario
app.post("/api/register", async (req, res) => {
  const { nombre, apellido, celular, extension, correo, password } = req.body;

  // 📌 Validación de campos obligatorios
  if (!nombre || !apellido || !celular || !correo || !password) {
    return res.status(400).json({ mensaje: "⚠️ Todos los campos son obligatorios." });
  }

  try {
    // 📌 Verificar si el usuario ya existe por correo o celular
    const usuarioExistente = await Usuario.findOne({ $or: [{ correo }, { celular }] });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "⚠️ Usuario ya registrado con este correo o celular." });
    }

    // 📌 Agregar extensión al número de celular
    const celularConExtension = extension ? `${extension}-${celular}` : celular;

    // 📌 Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📌 Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      celular: celularConExtension,
      extension,
      correo,
      password: hashedPassword,
    });

    await nuevoUsuario.save();

    // 📌 Generar token JWT
    const token = jwt.sign({ usuario: nuevoUsuario.correo }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ mensaje: "✅ Registro exitoso", token });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ mensaje: "❌ Error en el servidor" });
  }
});

// 📌 Inicio de Sesión
app.post("/api/login", async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuarioDB = await Usuario.findOne({ correo });
    if (!usuarioDB) return res.status(400).json({ mensaje: "⚠️ Usuario o contraseña incorrectos" });

    const esValido = await bcrypt.compare(password, usuarioDB.password);
    if (!esValido) return res.status(400).json({ mensaje: "⚠️ Usuario o contraseña incorrectos" });

    const token = jwt.sign({ usuario: usuarioDB.correo }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ mensaje: "✅ Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("❌ Error en el inicio de sesión:", error);
    res.status(500).json({ mensaje: "❌ Error en el servidor" });
  }
});

// 📌 Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(colors.cyan(`🚀 Servidor corriendo en http://localhost:${PORT}`));
});
