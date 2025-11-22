import { NextRequest, NextResponse } from "next/server";
import {
  LoginEmployerSchema,
  type ApiResponse,
} from "@/projects/backend/lib/types";
import { loginEmployer } from "@/projects/backend/lib/usecases";

// POST /api/admin/auth/login - Авторизация работодателя
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация данных
    const validation = LoginEmployerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Ошибка валидации",
          data: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Выполняем Use Case
    const result = await loginEmployer(validation.data);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.data, // Включает employer + token
      message: "Успешная авторизация",
    });
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
