import express from "express";
import multer from "multer";
import { registrarGato, obtenerGatos, actualizarGato, eliminarGato } from '../controllers/gato.controller.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/gato", upload.single("imagen"), registrarGato);
// routes/gato.routes.js
import { capturarInfoSolicitud } from "../middlewares/auditoria.js";

router.put(
  "/gato/:id",
  capturarInfoSolicitud,
  upload.single("imagen"),
  actualizarGato
)

router.get('/gatos', obtenerGatos);

router.delete("/gato/:id", eliminarGato);

export default router;
