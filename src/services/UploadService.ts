import { Pool } from "pg";
import { processImage } from "./googleGeminiService";

interface ProcessUploadResult {
  success: boolean;
  image_url?: string;
  measure_value?: number;
  measure_uuid?: string;
  status?: number;
  error_code?: string;
  error_description?: string;
}

export class UploadService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async processUpload(
    customer_code: string,
    measure_datetime: string,
    measure_type: string,
    image: string
  ): Promise<ProcessUploadResult> {
    try {
      const parsedDate = new Date(measure_datetime);
      const currentMonth = parsedDate.getMonth() + 1;
      const currentYear = parsedDate.getFullYear();

      const existingReading = await this.pool.query(
        `
        SELECT * FROM readings
        WHERE customer_code = $1
          AND measure_type = $2
          AND EXTRACT(MONTH FROM measure_datetime) = $3
          AND EXTRACT(YEAR FROM measure_datetime) = $4
      `,
        [customer_code, measure_type.toUpperCase(), currentMonth, currentYear]
      );

      if (existingReading.rowCount === null || existingReading.rowCount > 0) {
        return {
          success: false,
          status: 409,
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        };
      }

      const { description } = await processImage(image);

      const result = await this.pool.query(
        `
        INSERT INTO readings (customer_code, measure_datetime, measure_type, image, description)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, image
      `,
        [
          customer_code,
          measure_datetime,
          measure_type.toUpperCase(),
          image,
          description,
        ]
      );

      const measure_uuid = result.rows[0].id;
      const insertedImage = result.rows[0].image;

      const measure_value = this.extractNumberFromDescription(description);

      return {
        success: true,
        image_url: `path/to/image/${measure_uuid}`,
        measure_value,
        measure_uuid,
      };
    } catch (error) {
      console.error("Erro ao processar upload:", error);
      return {
        success: false,
        status: 500,
        error_code: "INTERNAL_ERROR",
        error_description: "Erro interno do servidor.",
      };
    }
  }

  private extractNumberFromDescription(
    description: string
  ): number | undefined {
    const match = description.match(/\d+/);
    return match ? parseInt(match[0], 10) : undefined;
  }
}
