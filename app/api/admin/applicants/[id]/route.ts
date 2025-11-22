import { NextRequest, NextResponse } from "next/server";
import {
  UpdateApplicantStatusSchema,
  type ApiResponse,
} from "@/projects/backend/lib/types";
import {
  getApplicantById,
  updateApplicantStatus,
} from "@/projects/backend/lib/usecases";
import { getEmployerFromRequest } from "@/projects/backend/lib/auth";

// GET /api/admin/applicants/[id] - Получить один отклик
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Выполняем Use Case
    const result = await getApplicantById(params.id);

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
    console.error("Ошибка при получении отклика:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/applicants/[id] - Обновить статус отклика
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Валидация данных
    const validation = UpdateApplicantStatusSchema.safeParse(body);
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

    // Выполняем Use Case (внутри отправляются уведомления)
    const result = await updateApplicantStatus(params.id, validation.data);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: result.error === "Отклик не найден" ? 404 : 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result.data,
      message: "Статус отклика успешно обновлен",
    });
  } catch (error) {
    console.error("Ошибка при обновлении статуса отклика:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
