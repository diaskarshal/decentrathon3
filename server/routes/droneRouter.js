const Router = require("express");
const router = new Router();
const droneController = require("../controllers/droneController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my", authMiddleware, droneController.getMyDrones);
router.post("/", authMiddleware, droneController.create);
router.get("/", droneController.getAll);
router.get("/:id", droneController.getOne);
router.put("/:id", authMiddleware, droneController.update);
router.delete("/:id", authMiddleware, droneController.delete);

module.exports = router;
