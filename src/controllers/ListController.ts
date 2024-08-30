import { Request, Response } from "express";
import { ListService } from "../services/ListService";
import { CustomError } from "./UploadController";

export class ListController {
  private listService: ListService;

  constructor(listService: ListService) {
    this.listService = listService;
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { customer_code } = req.params;
      const { measure_type } = req.query;

      if (!customer_code) {
        res.status(400).json({ message: "Código do cliente é obrigatório." });
        return;
      }

      const validMeasureType = measure_type
        ? (measure_type as string).toUpperCase()
        : "";
      if (validMeasureType && !["WATER", "GAS"].includes(validMeasureType)) {
        res.status(400).json({
          message:
            'Tipo de medição não permitida. Os valores aceitos são "WATER" ou "GAS".',
        });
        return;
      }

      const readings = await this.listService.listReadings(
        customer_code,
        validMeasureType
      );

      res.status(200).json({
        message: "Operação realizada com sucesso",
        customer_code: customer_code,
        measures: readings.map((reading) => ({
          measure_uuid: reading.id,
          measure_datetime: reading.measure_datetime,
          measure_type: reading.measure_type,
          has_confirmed: reading.confirmed,
          image_url: reading.image_url,
        })),
      });
    } catch (error) {
      const typedError = error as CustomError;

      if (typedError.status === 400 || typedError.status === 404) {
        res.status(typedError.status).json({
          error_code: typedError.error_code,
          error_description: typedError.error_description,
        });
      } else {
        res.status(500).json({ message: "Erro interno do servidor." });
      }
    }
  }
}
