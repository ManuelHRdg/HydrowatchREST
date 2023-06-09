import {Router} from "express";
import {methods as nivelesController} from "./../controllers/niveles.controller.js";

const router = Router();

//Ruta de prueba
router.get("/saludo", nivelesController.saludar);

router.get("/", nivelesController.getNiveles);
router.get("/:nombreTanque", nivelesController.getNivel);
router.post("/", nivelesController.llenarTanque);

export default router;