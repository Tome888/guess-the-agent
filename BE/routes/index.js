import express from "express";
import testRoute from "./test.js";
import createRoom from "./createRoom.js"
import joinRoom from "./joinRoom.js"


const router = express.Router();


router.use("/", testRoute);
router.use("/create-room", createRoom);
router.use("/join-room", joinRoom);




export default router;