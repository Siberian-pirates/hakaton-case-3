import { NextRequest, NextResponse } from "next/server";
import {
  UpdateVacancySchema,
  type ApiResponse,
} from "@/projects/backend/lib/types";
import {
  getVacancyById,
  updateVacancy,
  deleteVacancy,
} from "@/projects/backend/lib/usecases";
import { getEmployerFromRequest } from "@/projects/backend/lib/auth";

// GET /api/admin/vacancies/[id] - Получить одну вакансию
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Выполняем Use Case
    const result = await getVacancyById(params.id);

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

// PATCH /api/admin/vacancies/[id] - Обновить вакансию
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Валидация данных
    const validation = UpdateVacancySchema.safeParse(body);
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
    const result = await updateVacancy(params.id, validation.data);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: result.error === "Вакансия не найдена" ? 404 : 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.data,
      message: "Вакансия успешно обновлена",
    });
  } catch (error) {
    console.error("Ошибка при обновлении вакансии:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/vacancies/[id] - Удалить вакансию
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Выполняем Use Case
    const result = await deleteVacancy(params.id);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: result.error === "Вакансия не найдена" ? 404 : 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Ошибка при удалении вакансии:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

