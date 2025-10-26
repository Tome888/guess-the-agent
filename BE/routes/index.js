import express from "express";
import testRoute from "./test.js";
import createRoom from "./createRoom.js"
import joinRoom from "./joinRoom.js"
import validateToken from "./validateToken.js"
import sendUserAgents from "./sendUserAgents.js"
import updateAgentsArray from "./updateAgentsArray.js"
import getRoomChat from "./getRoomChat.js"
import getMyAgent from "./getMyAgent.js"
import leaveRoom from "./leaveRoom.js"

const router = express.Router();


router.use("/", testRoute);
router.use("/create-room", createRoom);
router.use("/join-room", joinRoom);
router.use("/validate-token", validateToken);
router.use("/get-user-agents", sendUserAgents);
router.use("/update-agents-array", updateAgentsArray);
router.use("/get-room-chat", getRoomChat)
router.use("/get-my-agent", getMyAgent)
router.use("/leave-room", leaveRoom)







export default router;