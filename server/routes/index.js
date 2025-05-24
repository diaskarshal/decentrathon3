const Router = require("express");
const router = new Router();
const droneRouter = require("./droneRouter");
const flightRouter = require("./flightRouter");
const userRouter = require("./userRouter");
const noFlyZoneRouter = require("./noFlyZoneRouter");

router.use("/drone", droneRouter);
router.use("/flight", flightRouter);
router.use("/user", userRouter);
router.use("/noflyzone", noFlyZoneRouter);

module.exports = router;