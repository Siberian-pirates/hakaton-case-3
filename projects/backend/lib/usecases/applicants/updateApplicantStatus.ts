import prisma from "../../prisma";
import type { UpdateApplicantStatusInput } from "../../types";
// TODO: import { sendStatusChangeNotification } from "../../notifications";

/**
 * Use Case: Обновить статус отклика
 * 
 * @param id - ID отклика
 * @param input - новый статус
 * @returns обновленный отклик
 */
export async function updateApplicantStatus(
  id: string,
  input: UpdateApplicantStatusInput
) {
  try {
    // Получаем старый статус для уведомлений
    const oldApplicant = await prisma.applicant.findUnique({
      where: { id },
      include: {
        vacancy: true,
      },
    });

    if (!oldApplicant) {
      return {
        success: false,
        error: "Отклик не найден",
      };
    }

    // Обновляем статус
    const applicant = await prisma.applicant.update({
      where: { id },
      data: {
        status: input.status,
      },
      include: {
        vacancy: true,
      },
    });

    // TODO: Отправить уведомления соискателю о смене статуса
    // await sendStatusChangeNotification({
    //   applicantName: applicant.name,
    //   applicantEmail: applicant.email,
    //   applicantTelegramChatId: applicant.telegramChatId,
    //   vacancyTitle: applicant.vacancy.title,
    //   oldStatus: oldApplicant.status,
    //   newStatus: applicant.status,
    // });

    return {
      success: true,
      data: applicant,
    };
  } catch (error) {
    console.error("Ошибка в updateApplicantStatus:", error);
    return {
      success: false,
      error: "Ошибка при обновлении статуса отклика",
    };
  }
}

