import prisma from "../../prisma";

/**
 * Use Case: Удалить вакансию
 * 
 * @param id - ID вакансии
 * @returns результат удаления
 */
export async function deleteVacancy(id: string) {
  try {
    // Проверяем существование вакансии
    const existingVacancy = await prisma.vacancy.findUnique({
      where: { id },
    });

    if (!existingVacancy) {
      return {
        success: false,
        error: "Вакансия не найдена",
      };
    }

    // Удаляем вакансию (все связи удалятся автоматически через onDelete: Cascade)
    await prisma.vacancy.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Вакансия успешно удалена",
    };
  } catch (error) {
    console.error("Ошибка в deleteVacancy:", error);
    return {
      success: false,
      error: "Ошибка при удалении вакансии",
    };
  }
}

