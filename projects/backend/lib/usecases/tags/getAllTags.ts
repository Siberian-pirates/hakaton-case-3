import prisma from "../../prisma";

interface GetAllTagsOptions {
  includeCount?: boolean;
}

/**
 * Use Case: Получить все теги
 * 
 * @param options - опции (включить количество вакансий)
 * @returns список всех тегов
 */
export async function getAllTags(options: GetAllTagsOptions = {}) {
  try {
    const { includeCount = false } = options;

    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      ...(includeCount && {
        include: {
          _count: {
            select: {
              vacancies: true,
            },
          },
        },
      }),
      ...(!includeCount && {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    });

    return {
      success: true,
      data: tags,
    };
  } catch (error) {
    console.error("Ошибка в getAllTags:", error);
    return {
      success: false,
      error: "Ошибка при получении тегов",
    };
  }
}

