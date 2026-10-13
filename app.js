import express from "express";
import cors from "cors";
import gatoRoutes from "./routes/gato.routes.js";
import climaRoutes from "./routes/clima.routes.js";
import rateLimit from "express-rate-limit";
import db from "./firebase.js";
import { capturarInfoSolicitud } from "./middlewares/auditoria.js";

const limiterGatos = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensaje: "Demasiadas peticiones desde esta IP. Intenta de nuevo más tarde.",
  },
  handler: async (req, res, next, options) => {
    try {
      if (db && typeof db.collection === "function") {
        await db.collection("auditoria_gatos").add({
          accion: "rate_limit_bloqueado",
          fecha: new Date().toISOString(),
          ip: req.auditoria?.ip || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip,
          userAgent: req.auditoria?.userAgent || req.headers["user-agent"],
          ruta: req.auditoria?.ruta || req.originalUrl,
          metodo: req.auditoria?.metodo || req.method,
        });
      }
    } catch (e) {}
    res.status(options.statusCode).json(options.message);
  },
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(capturarInfoSolicitud);

app.use("/gato", limiterGatos);
app.use("/gatos", limiterGatos);
app.use(gatoRoutes);
app.use(climaRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no registrada." });
});

export default app;
