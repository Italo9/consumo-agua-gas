import { Pool } from "pg";

interface CustomError extends Error {
  status?: number;
  error_code?: string;
  error_description?: string;
}

interface Measure {
  id: string;
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  confirmed: boolean
}

export class ListService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async listReadings(
    customer_code: string,
    measure_type?: string
  ): Promise<Measure[]> {
    try {
      let query = "SELECT * FROM readings WHERE customer_code = $1";
      const queryParams: any[] = [customer_code];

      if (measure_type) {
        query += " AND measure_type = $2";
        queryParams.push(measure_type);
      }

      const result = await this.pool.query(query, queryParams);

      if (result.rows.length === 0) {
        const error: CustomError = new Error("Nenhuma leitura encontrada");
        error.status = 404;
        error.error_code = "MEASURES_NOT_FOUND";
        error.error_description = "Nenhuma leitura encontrada";
        throw error;
      }

      return result.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
