const Router = require("express");
const router = new Router();
const droneRouter = require("./droneRouter");
const pilotRouter = require("./pilotRouter");
const flightRouter = require("./flightRouter");
const userRouter = require("./userRouter");

router.use("/drone", droneRouter);
router.use("/pilot", pilotRouter);
router.use("/flight", flightRouter);
router.use("/user", userRouter);

module.exports = router;