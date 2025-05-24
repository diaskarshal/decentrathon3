const Router = require("express");
const router = new Router();
const droneController = require("../controllers/droneController");

router.post("/", droneController.create);
router.get("/", droneController.getAll);
router.get("/:id", droneController.getOne);
router.put("/:id", droneController.update);
router.delete("/:id", droneController.delete);

module.exports = router;
