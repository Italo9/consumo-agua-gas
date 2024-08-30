import express from "express";
import pool from "../config/database";
import { ListService } from "../services/ListService";

const router = express.Router();
const listService = new ListService(pool);

router.get("/:customer_code/list", async (req, res) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  try {
    const readings = await listService.listReadings(
      customer_code,
      measure_type as string
    );
    res.json(readings);
  } catch (error) {
    const typedError = error as Error;
    res.status(500).json({ error: typedError.message });
  }
});

export default router;
