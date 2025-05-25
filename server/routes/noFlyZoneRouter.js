const Router = require("express");
const router = new Router();
const noFlyZoneController = require("../controllers/noFlyZoneController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

//Admin only CRUD
router.post("/", authMiddleware, checkRoleMiddleware("ADMIN"), noFlyZoneController.create);
router.put("/:id", authMiddleware, checkRoleMiddleware("ADMIN"), noFlyZoneController.update);
router.delete("/:id", authMiddleware, checkRoleMiddleware("ADMIN"), noFlyZoneController.delete);

//Public
router.get("/", noFlyZoneController.getAll);
router.get("/:id", noFlyZoneController.getOne);

module.exports = router;
