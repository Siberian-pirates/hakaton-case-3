import { NextRequest, NextResponse } from "next/server";
import {
  CreateVacancySchema,
  type ApiResponse,
} from "@/projects/backend/lib/types";
import {
  getVacanciesByEmployer,
  createVacancy,
} from "@/projects/backend/lib/usecases";
import { getEmployerFromRequest } from "@/projects/backend/lib/auth";

// GET /api/admin/vacancies - Получить все вакансии работодателя
export async function GET(req: NextRequest) {
  try {
    // Получаем данные работодателя из заголовков (установлены middleware)
    const employer = getEmployerFromRequest(req);

    // Выполняем Use Case (используем employerId из токена)
    const result = await getVacanciesByEmployer(employer.employerId);

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

// POST /api/admin/vacancies - Создать новую вакансию
export async function POST(req: NextRequest) {
  try {
    // Получаем данные работодателя из заголовков (установлены middleware)
    const employer = getEmployerFromRequest(req);
    
    const body = await req.json();

    // Валидация данных
    const validation = CreateVacancySchema.safeParse(body);
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

    // Добавляем employerId из токена
    const vacancyData = {
      ...validation.data,
      employerId: employer.employerId,
    };

    // Выполняем Use Case
    const result = await createVacancy(vacancyData);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: result.data,
        message: "Вакансия успешно создана",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании вакансии:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

