import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader, type JwtPayload } from "./jwt";
import type { ApiResponse } from "../types";

/**
 * Middleware для проверки JWT токена
 * Возвращает employerId если токен валидный, иначе null
 */
export function verifyAuthToken(req: NextRequest): JwtPayload | null {
  const authHeader = req.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Wrapper для защищенных роутов
 * Проверяет токен и возвращает ошибку 401 если токен невалидный
 */
export function withAuth(
  handler: (
    req: NextRequest,
    context: any,
    employer: JwtPayload
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    const employer = verifyAuthToken(req);

    if (!employer) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    return handler(req, context, employer);
  };
}
