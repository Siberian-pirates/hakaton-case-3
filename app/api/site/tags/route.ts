import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/projects/backend/lib/types";
import { getAllTags } from "@/projects/backend/lib/usecases";

// GET /api/site/tags - Получить все теги (публичный endpoint)
export async function GET(req: NextRequest) {
  try {
    // Выполняем Use Case (без подсчета вакансий)
    const result = await getAllTags({ includeCount: false });

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

