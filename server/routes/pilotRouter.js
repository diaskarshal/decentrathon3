const Router = require("express");
const router = new Router();
const pilotController = require("../controllers/pilotController");

router.post("/", pilotController.create);
router.get("/", pilotController.getAll);
router.get("/:id", pilotController.getOne);
router.put("/:id", pilotController.update);
router.delete("/:id", pilotController.delete);

module.exports = router;
