import prisma from "../../prisma";

/**
 * Use Case: Получить все вакансии работодателя
 * 
 * @param employerId - ID работодателя
 * @returns список вакансий работодателя с тегами и количеством откликов
 */
export async function getVacanciesByEmployer(employerId: string) {
  try {
    const vacancies = await prisma.vacancy.findMany({
      where: { employerId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            applicants: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: vacancies,
    };
  } catch (error) {
    console.error("Ошибка в getVacanciesByEmployer:", error);
    return {
      success: false,
      error: "Ошибка при получении вакансий",
    };
  }
}

