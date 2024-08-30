import { Request, Response } from "express";
import { ConfirmResult, ConfirmService } from "../services/ConfirmService";
import { CustomError } from "./UploadController";

export class ConfirmController {
  private confirmService: ConfirmService;

  constructor(confirmService: ConfirmService) {
    this.confirmService = confirmService;
  }

  async confirm(req: Request, res: Response): Promise<void> {
    try {
      const { measure_uuid, confirmed_value } = req.body;

      if (!measure_uuid || typeof confirmed_value !== "number") {
        res.status(400).json({ message: "Dados inválidos." });
        return;
      }

      const result: ConfirmResult = await this.confirmService.confirmReading(
        measure_uuid,
        confirmed_value
      );
      if (result.success) {
        res.status(200).json({
          message: "Operação realizada com sucesso",
          success: true,
        });
      } else {
        res.status(result.status).json({
          error_code: result.error_code,
          error_description: result.error_description,
        });
      }
    } catch (error) {
      const typedError = error as CustomError;
      res.status(500).json({
        message: "Erro interno do servidor.",
        error: typedError.message,
      });
    }
  }
}
