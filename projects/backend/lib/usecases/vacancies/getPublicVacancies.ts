import prisma from "../../prisma";

interface GetPublicVacanciesInput {
  search?: string;
  tags?: string[]; // slugs тегов
  page?: number;
  limit?: number;
}

/**
 * Use Case: Получить публичные активные вакансии с фильтрацией и пагинацией
 * 
 * @param input - параметры фильтрации и пагинации
 * @returns список вакансий с пагинацией
 */
export async function getPublicVacancies(input: GetPublicVacanciesInput = {}) {
  try {
    const { search, tags, page = 1, limit = 10 } = input;
    const skip = (page - 1) * limit;

    // Фильтры
    const where: any = {
      isActive: true,
    };

    // Поиск по названию и описанию
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Фильтр по тегам (slug)
    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            slug: {
              in: tags,
            },
          },
        },
      };
    }

    // Получаем вакансии с пагинацией
    const [vacancies, total] = await Promise.all([
      prisma.vacancy.findMany({
        where,
        include: {
          employer: {
            select: {
              name: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.vacancy.count({ where }),
    ]);

    return {
      success: true,
      data: {
        vacancies,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Ошибка в getPublicVacancies:", error);
    return {
      success: false,
      error: "Ошибка при получении вакансий",
    };
  }
}

