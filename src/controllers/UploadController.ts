import { Request, Response } from "express";
import { UploadService } from "../services/UploadService";

export interface Reading {
  id?: string; 
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
  confirmed: boolean;
  image: string;
}

export interface CustomError extends Error {
  status?: number; 
  error_code?: string;
  error_description?: string; 
}

export class UploadController {
  private uploadService: UploadService;

  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
  }

  private validateReadingParams(params: Reading): void {
    if (!params.customer_code || typeof params.customer_code !== "string") {
      throw new Error("Invalid customer code");
    }

    if (
      !params.measure_datetime ||
      isNaN(Date.parse(params.measure_datetime))
    ) {
      throw new Error("Invalid measure datetime");
    }

    if (!params.measure_type || typeof params.measure_type !== "string") {
      throw new Error("Invalid measure type");
    }

    if (!params.image || !this.isValidBase64(params.image)) {
      throw new Error("Invalid description: not a valid Base64 string");
    }
  }

  private isValidBase64(str: string): boolean {
    const base64Prefix = /^data:image\/jpeg;base64,/;
    const base64Body = /^[A-Za-z0-9+/]*={0,2}$/;

    if (base64Prefix.test(str)) {
      const base64Data = str.replace(base64Prefix, "");
      return base64Body.test(base64Data);
    }

    return false;
  }

  public async upload(req: Request, res: Response): Promise<void> {
    try {
      this.validateReadingParams(req.body);

      const { customer_code, measure_datetime, measure_type, image } = req.body;

      const result = await this.uploadService.processUpload(
        customer_code,
        measure_datetime,
        measure_type,
        image
      );

      if (result.success) {
        res.status(200).json({
          image_url: result.image_url,
          measure_value: result.measure_value,
          measure_uuid: result.measure_uuid,
        });
      } else {
        const status = result.status ?? 500;
        res.status(status).json({
          error_code: result.error_code,
          error_description: result.error_description,
        });
      }
    } catch (error) {
      const typedError = error as CustomError;
      if (typedError.message.includes("Duplicate")) {
        res.status(409).json({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        });
      } else if (typedError.message.includes("Invalid")) {
        res.status(400).json({
          error_code: "INVALID_DATA",
          error_description: typedError.message,
        });
      } else {
        res.status(500).json({
          error_code: "INTERNAL_SERVER_ERROR",
          error_description: "Erro interno do servidor",
        });
      }
    }
  }
}
