import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/projects/backend/lib/types";
import { getPublicVacancies } from "@/projects/backend/lib/usecases";

// GET /api/site/vacancies - Получить все активные вакансии (публичный endpoint)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Выполняем Use Case
    const result = await getPublicVacancies({
      search,
      tags,
      page,
      limit,
    });

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
    console.error("Ошибка при получении вакансий:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

