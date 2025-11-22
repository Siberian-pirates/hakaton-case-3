import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, ApplicationStatus } from "@/projects/backend/lib/types";
import { getApplicantsByEmployer } from "@/projects/backend/lib/usecases";
import { getEmployerFromRequest } from "@/projects/backend/lib/auth";

// GET /api/admin/applicants - Получить все отклики на вакансии работодателя
export async function GET(req: NextRequest) {
  try {
    // Получаем данные работодателя из заголовков (установлены middleware)
    const employer = getEmployerFromRequest(req);

    const { searchParams } = new URL(req.url);
    const vacancyId = searchParams.get("vacancyId");
    const status = searchParams.get("status");

    // Выполняем Use Case (используем employerId из токена)
    const result = await getApplicantsByEmployer({
      employerId: employer.employerId,
      vacancyId: vacancyId || undefined,
      status: (status as ApplicationStatus) || undefined,
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
    console.error("Ошибка при получении откликов:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

