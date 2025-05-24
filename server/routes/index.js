const Router = require("express");
const router = new Router();
const droneRouter = require("./droneRouter");
const flightRouter = require("./flightRouter");
const userRouter = require("./userRouter");

router.use("/drone", droneRouter);
router.use("/flight", flightRouter);
router.use("/user", userRouter);

module.exports = router;