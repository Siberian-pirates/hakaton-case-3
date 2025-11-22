import { NextRequest } from "next/server";
import type { JwtPayload } from "./jwt";

/**
 * Получить данные работодателя из заголовков запроса
 * (устанавливаются middleware после проверки JWT)
 */
export function getEmployerFromRequest(req: NextRequest): JwtPayload {
  const employerId = req.headers.get("x-employer-id");
  const email = req.headers.get("x-employer-email");
  const name = req.headers.get("x-employer-name");

  if (!employerId || !email || !name) {
    throw new Error("Employer data not found in request headers");
  }

  return {
    employerId,
    email,
    name,
  };
}

