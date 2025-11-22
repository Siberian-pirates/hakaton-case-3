import { NextRequest, NextResponse } from "next/server";
import {
  CreateTagSchema,
  type ApiResponse,
} from "@/projects/backend/lib/types";
import { getAllTags, createTag } from "@/projects/backend/lib/usecases";
import { getEmployerFromRequest } from "@/projects/backend/lib/auth";

// GET /api/admin/tags - Получить все теги
export async function GET(req: NextRequest) {
  try {
    // Выполняем Use Case (с подсчетом вакансий)
    const result = await getAllTags({ includeCount: true });

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Ошибка при получении тегов:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// POST /api/admin/tags - Создать новый тег
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация данных
    const validation = CreateTagSchema.safeParse(body);
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

    // Выполняем Use Case (проверка уникальности внутри)
    const result = await createTag(validation.data);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        {
          status:
            result.error === "Тег с таким slug уже существует" ? 409 : 500,
        }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: result.data,
        message: "Тег успешно создан",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании тега:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

