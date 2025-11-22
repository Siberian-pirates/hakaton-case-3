import prisma from "../../prisma";
import type { LoginEmployerInput } from "../../types";
import { comparePassword } from "../../auth/password";
import { generateToken } from "../../auth/jwt";

interface LoginEmployerResult {
  success: boolean;
  data?: {
    employer: {
      id: string;
      email: string;
      name: string;
      telegramChatId: string | null;
      telegramUsername: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    token: string;
  };
  error?: string;
}

/**
 * Use Case: Авторизация работодателя
 *
 * @param input - данные для входа (email, password)
 * @returns объект работодателя без пароля + JWT токен или ошибка
 */
export async function loginEmployer(
  input: LoginEmployerInput
): Promise<LoginEmployerResult> {
  try {
    // Поиск работодателя по email
    const employer = await prisma.employer.findUnique({
      where: { email: input.email },
    });

    if (!employer) {
      return {
        success: false,
        error: "Неверный email или пароль",
      };
    }

    // Проверка пароля через bcrypt
    const isPasswordValid = await comparePassword(
      input.password,
      employer.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Неверный email или пароль",
      };
    }

    // Возвращаем данные без пароля
    const { password, ...employerData } = employer;

    // Генерируем JWT токен
    const token = generateToken({
      employerId: employer.id,
      email: employer.email,
      name: employer.name,
    });

    return {
      success: true,
      data: {
        employer: employerData,
        token,
      },
    };
  } catch (error) {
    console.error("Ошибка в loginEmployer:", error);
    return {
      success: false,
      error: "Ошибка при авторизации",
    };
  }
}
