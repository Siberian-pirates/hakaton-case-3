import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "./jwt";

/**
 * Middleware для проверки JWT токена и защиты админских роутов
 *
 * Проверяет все запросы к /api/admin/* (кроме /api/admin/auth/*)
 * и добавляет данные работодателя в заголовки запроса
 */
export function authMiddleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Проверяем только админские роуты, кроме auth
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Невалидный токен" },
        { status: 401 }
      );
    }

    // Добавляем данные пользователя в заголовки запроса
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-employer-id", payload.employerId);
    requestHeaders.set("x-employer-email", payload.email);
    requestHeaders.set("x-employer-name", payload.name);

    // Продолжаем запрос с новыми заголовками
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Для всех остальных роутов просто пропускаем
  return NextResponse.next();
}

/**
 * Конфигурация matcher для оптимизации
 * Middleware будет запускаться только для указанных путей
 */
export const authMiddlewareConfig = {
  matcher: [
    // Проверяем только API роуты админки
    "/api/admin/:path*",
  ],
};
