import { NextRequest, NextResponse } from "next/server";
import {
  CreateEmployerSchema,
  type ApiResponse,
} from "@/projects/backend/lib/types";
import { registerEmployer } from "@/projects/backend/lib/usecases";

// POST /api/admin/auth - Регистрация работодателя
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация данных
    const validation = CreateEmployerSchema.safeParse(body);
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
    const result = await registerEmployer(validation.data);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: result.error === "Email уже используется" ? 409 : 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: result.data, // Включает employer + token
        message: "Работодатель успешно зарегистрирован",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при регистрации работодателя:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
