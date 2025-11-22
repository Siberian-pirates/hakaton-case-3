import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/projects/backend/lib/types";
import { getVacancyById } from "@/projects/backend/lib/usecases";

// GET /api/site/vacancies/[id] - Получить одну вакансию (публичный endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Выполняем Use Case (только активные вакансии)
    const result = await getVacancyById(params.id, {
      includeEmployer: true,
      onlyActive: true,
    });

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Ошибка при получении вакансии:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

