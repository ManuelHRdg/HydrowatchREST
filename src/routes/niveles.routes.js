import {Router} from "express";
import {methods as nivelesController} from "./../controllers/niveles.controller.js";

const router = Router();

router.get("/", nivelesController.getNiveles);
router.get("/:nombreTanque", nivelesController.getNivel);
router.post("/", nivelesController.llenarTanque);

export default router;