import prisma from "../../prisma";
import type { ApplicationStatus } from "../../types";

interface GetApplicantsByEmployerInput {
  employerId: string;
  vacancyId?: string;
  status?: ApplicationStatus;
}

/**
 * Use Case: Получить все отклики на вакансии работодателя
 *
 * @param input - параметры фильтрации (employerId, vacancyId, status)
 * @returns список откликов с информацией о вакансиях
 */
export async function getApplicantsByEmployer(
  input: GetApplicantsByEmployerInput
) {
  try {
    const { employerId, vacancyId, status } = input;

    // Фильтр: отклики только на вакансии данного работодателя
    const applicants = await prisma.applicant.findMany({
      where: {
        vacancy: {
          employerId,
        },
        ...(vacancyId && { vacancyId }),
        ...(status && { status }),
      },
      include: {
        vacancy: {
          select: {
            id: true,
            title: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: applicants,
    };
  } catch (error) {
    console.error("Ошибка в getApplicantsByEmployer:", error);
    return {
      success: false,
      error: "Ошибка при получении откликов",
    };
  }
}
