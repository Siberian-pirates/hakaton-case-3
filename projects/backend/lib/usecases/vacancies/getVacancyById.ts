import prisma from "../../prisma";

interface GetVacancyByIdOptions {
  includeEmployer?: boolean;
  onlyActive?: boolean;
}

/**
 * Use Case: Получить вакансию по ID
 * 
 * @param id - ID вакансии
 * @param options - опции запроса (включить работодателя, только активные)
 * @returns вакансия с тегами и количеством откликов
 */
export async function getVacancyById(
  id: string,
  options: GetVacancyByIdOptions = {}
) {
  try {
    const { includeEmployer = true, onlyActive = false } = options;

    const vacancy = await prisma.vacancy.findUnique({
      where: {
        id,
        ...(onlyActive && { isActive: true }),
      },
      include: {
        ...(includeEmployer && {
          employer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        }),
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
    });

    if (!vacancy) {
      return {
        success: false,
        error: "Вакансия не найдена",
      };
    }

    return {
      success: true,
      data: vacancy,
    };
  } catch (error) {
    console.error("Ошибка в getVacancyById:", error);
    return {
      success: false,
      error: "Ошибка при получении вакансии",
    };
  }
}

