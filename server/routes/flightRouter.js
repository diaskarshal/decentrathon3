const Router = require("express");
const router = new Router();
const flightController = require("../controllers/flightController");

router.post("/", flightController.create);
router.get("/", flightController.getAll);
router.get("/:id", flightController.getOne);
router.put("/:id", flightController.update);
router.delete("/:id", flightController.delete);

//special endpoints to approve and finish flights
router.post("/:id/approve", flightController.approve);
router.post("/:id/finish", flightController.finish);

module.exports = router;
