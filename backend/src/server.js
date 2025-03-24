import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import colors from "colors";

// ✅ Configuración
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(colors.green("✅ Conectado a MongoDB")))
  .catch(err => console.error(colors.red("❌ Error en MongoDB:"), err));

// ✅ Esquemas y Modelos
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const reservaSchema = new mongoose.Schema({
  origen: { type: String, required: true },
  destino: { type: String, required: true },
  fechaSalida: { type: Date, required: true },
  fechaRegreso: { type: Date, required: true },
  costo: { type: Number, required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  creadaEn: { type: Date, default: Date.now },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
const Reserva = mongoose.model("Reserva", reservaSchema);

// ✅ Middleware: Verificar Token
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "⚠️ No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded.usuarioId;
    next();
  } catch {
    return res.status(403).json({ mensaje: "❌ Token inválido" });
  }
};

// ✅ Registro de Usuario
app.post("/api/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ nombre, correo, password: hashedPassword });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "✅ Usuario registrado con éxito." });
  } catch (error) {
    res.status(500).json({ mensaje: "❌ Error al registrar usuario." });
  }
});

// ✅ Inicio de Sesión
app.post("/api/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario || !await bcrypt.compare(password, usuario.password)) {
      return res.status(401).json({ mensaje: "⚠️ Credenciales inválidas." });
    }

    const token = jwt.sign({ usuarioId: usuario._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ mensaje: "✅ Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ mensaje: "❌ Error en el servidor." });
  }
});

// ✅ Crear una Reserva (Autenticado)
app.post("/api/reservas", verificarToken, async (req, res) => {
  try {
    const { origen, destino, fechaSalida, fechaRegreso, costo } = req.body;

    const nuevaReserva = new Reserva({
      origen, destino, fechaSalida, fechaRegreso, costo, usuarioId: req.usuario
    });

    await nuevaReserva.save();
    res.status(201).json({ mensaje: "✅ Reserva creada con éxito.", reserva: nuevaReserva });
  } catch (error) {
    res.status(500).json({ mensaje: "❌ Error al crear la reserva." });
  }
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(colors.cyan(`🚀 Servidor en http://localhost:${PORT}`)));
