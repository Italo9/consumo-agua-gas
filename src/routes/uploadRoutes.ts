import express from "express";
import multer from "multer";
import { UploadController } from "../controllers/UploadController";
import { UploadService } from "../services/UploadService";
import pool from "../config/database";

const router = express.Router();
const uploadService = new UploadService(pool);
const uploadController = new UploadController(uploadService);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), (req, res) =>
  uploadController.upload(req, res)
);

export default router;
