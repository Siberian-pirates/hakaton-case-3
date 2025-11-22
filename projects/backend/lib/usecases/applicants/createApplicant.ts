import prisma from "../../prisma";
import type { CreateApplicantInput } from "../../types";
// TODO: import { sendNewApplicantNotification } from "../../notifications";

/**
 * Use Case: Создать отклик на вакансию
 * 
 * @param input - данные отклика (имя, email, резюме и т.д.)
 * @returns созданный отклик
 */
export async function createApplicant(input: CreateApplicantInput) {
  try {
    // Проверяем, что вакансия существует и активна
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: input.vacancyId },
      include: {
        employer: true,
      },
    });

    if (!vacancy) {
      return {
        success: false,
        error: "Вакансия не найдена",
      };
    }

    if (!vacancy.isActive) {
      return {
        success: false,
        error: "Вакансия неактивна",
      };
    }

    // Создаем отклик
    const applicant = await prisma.applicant.create({
      data: input,
      include: {
        vacancy: {
          select: {
            title: true,
          },
        },
      },
    });

    // TODO: Отправить уведомление работодателю о новом отклике
    // await sendNewApplicantNotification({
    //   employerName: vacancy.employer.name,
    //   employerTelegramChatId: vacancy.employer.telegramChatId,
    //   applicantName: applicant.name,
    //   applicantEmail: applicant.email,
    //   applicantPhone: applicant.phone,
    //   vacancyTitle: vacancy.title,
    //   applicantId: applicant.id,
    // });

    return {
      success: true,
      data: applicant,
    };
  } catch (error) {
    console.error("Ошибка в createApplicant:", error);
    return {
      success: false,
      error: "Ошибка при создании отклика",
    };
  }
}

