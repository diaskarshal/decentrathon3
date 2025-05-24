const Router = require("express");
const router = new Router();
const noFlyZoneController = require("../controllers/noFlyZoneController");

router.post("/", noFlyZoneController.create);
router.get("/", noFlyZoneController.getAll);
router.get("/:id", noFlyZoneController.getOne);
router.put("/:id", noFlyZoneController.update);
router.delete("/:id", noFlyZoneController.delete);

module.exports = router;
