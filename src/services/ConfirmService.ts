import { Pool } from "pg";

export interface ConfirmResult {
  success: boolean;
  status: number;
  error_code?: string;
  error_description?: string;
}

export class ConfirmService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async confirmReading(
    measure_uuid: string,
    confirmed_value: number
  ): Promise<ConfirmResult> {
    try {
      const result = await this.pool.query(
        `
                SELECT confirmed FROM readings WHERE guid = $1
            `,
        [measure_uuid]
      );

      if (result.rowCount === 0) {
        return {
          success: false,
          status: 404,
          error_code: "READING_NOT_FOUND",
          error_description: "Código de leitura não encontrado.",
        };
      }

      const reading = result.rows[0];
      if (reading.confirmed) {
        return {
          success: false,
          status: 409,
          error_code: "READING_ALREADY_CONFIRMED",
          error_description: "O código de leitura já foi confirmado.",
        };
      }

      await this.pool.query(
        `
                UPDATE readings SET confirmed_value = $1, confirmed = TRUE, updated_at = NOW() WHERE guid = $2
            `,
        [confirmed_value, measure_uuid]
      );

      return {
        success: true,
        status: 200,
      };
    } catch (error) {
      console.error("Erro ao confirmar a leitura:", error);
      return {
        success: false,
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "Erro ao confirmar a leitura.",
      };
    }
  }
}
