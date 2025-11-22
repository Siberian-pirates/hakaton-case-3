import prisma from "../../prisma";
import type { UpdateVacancyInput } from "../../types";

/**
 * Use Case: Обновить вакансию
 * 
 * @param id - ID вакансии
 * @param input - данные для обновления
 * @returns обновленная вакансия с тегами
 */
export async function updateVacancy(id: string, input: UpdateVacancyInput) {
  try {
    const { tags, ...vacancyData } = input;

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

    // Обновляем вакансию
    const vacancy = await prisma.vacancy.update({
      where: { id },
      data: {
        ...vacancyData,
        ...(tags !== undefined && {
          tags: {
            deleteMany: {}, // Удаляем все старые связи
            create: tags.map((tagId) => ({
              tag: {
                connect: { id: tagId },
              },
            })),
          },
        }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      success: true,
      data: vacancy,
    };
  } catch (error) {
    console.error("Ошибка в updateVacancy:", error);
    return {
      success: false,
      error: "Ошибка при обновлении вакансии",
    };
  }
}

