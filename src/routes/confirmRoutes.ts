import express from "express";
import pool from "../config/database";
import { ConfirmService } from "../services/ConfirmService";

const router = express.Router();
const confirmService = new ConfirmService(pool);

router.patch("/confirm", async (req, res) => {
  const { measure_uuid, confirmed_value } = req.body;

  try {
    const success = await confirmService.confirmReading(
      measure_uuid,
      confirmed_value
    );
    if (success) {
      res.json({ message: "OK" });
    } else {
      res.status(400).json({ message: "ERRO" });
    }
  } catch (error) {
    const typedError = error as Error;
    res.status(500).json({ error: typedError.message });
  }
});

export default router;
