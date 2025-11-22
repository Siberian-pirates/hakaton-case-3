import prisma from "../../prisma";

/**
 * Use Case: Получить отклик по ID
 * 
 * @param id - ID отклика
 * @returns отклик с информацией о вакансии и работодателе
 */
export async function getApplicantById(id: string) {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: {
        vacancy: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!applicant) {
      return {
        success: false,
        error: "Отклик не найден",
      };
    }

    return {
      success: true,
      data: applicant,
    };
  } catch (error) {
    console.error("Ошибка в getApplicantById:", error);
    return {
      success: false,
      error: "Ошибка при получении отклика",
    };
  }
}

