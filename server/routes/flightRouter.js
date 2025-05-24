// /server/routes/flightRouter.js
const Router = require("express");
const router = new Router();
const flightController = require("../controllers/flightController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/my", authMiddleware, flightController.getMyFlights);
router.post("/", authMiddleware, flightController.create);

router.post(
  "/:id/approve",
  authMiddleware,
  checkRoleMiddleware("ADMIN"),
  flightController.approve
);
router.post(
  "/:id/finish",
  authMiddleware,
  checkRoleMiddleware("ADMIN"),
  flightController.finish
);

router.get("/", authMiddleware, flightController.getAll);
router.get("/:id", authMiddleware, flightController.getOne);
router.put("/:id", authMiddleware, flightController.update);
router.delete("/:id", authMiddleware, flightController.delete);

module.exports = router;
