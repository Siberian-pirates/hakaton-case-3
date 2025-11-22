import prisma from "../../prisma";
import type { CreateVacancyInput } from "../../types";

/**
 * Use Case: Создать новую вакансию
 * 
 * @param input - данные для создания вакансии
 * @returns созданная вакансия с тегами
 */
export async function createVacancy(input: CreateVacancyInput) {
  try {
    const { tags, ...vacancyData } = input;

    // Создаем вакансию с тегами
    const vacancy = await prisma.vacancy.create({
      data: {
        ...vacancyData,
        tags: tags
          ? {
              create: tags.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            }
          : undefined,
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
    console.error("Ошибка в createVacancy:", error);
    return {
      success: false,
      error: "Ошибка при создании вакансии",
    };
  }
}

