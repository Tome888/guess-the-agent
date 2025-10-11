import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.send({msg:"hello world"});
});

export default router;
