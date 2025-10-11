import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.send({msg:"join room"});
});

export default router;