import { NextRequest, NextResponse } from "next/server";
import {
  CreateApplicantSchema,
  type ApiResponse,
} from "@/projects/backend/lib/types";
import { createApplicant } from "@/projects/backend/lib/usecases";

// POST /api/site/applicants - Создать отклик на вакансию (публичный endpoint)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация данных
    const validation = CreateApplicantSchema.safeParse(body);
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

    // Выполняем Use Case (проверка вакансии и уведомления внутри)
    const result = await createApplicant(validation.data);

    if (!result.success) {
      const statusCode =
        result.error === "Вакансия не найдена"
          ? 404
          : result.error === "Вакансия неактивна"
            ? 400
            : 500;

      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: statusCode }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: result.data,
        message:
          "Ваш отклик успешно отправлен! Работодатель свяжется с вами в ближайшее время.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании отклика:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

