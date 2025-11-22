import prisma from "../../prisma";
import type { CreateEmployerInput } from "../../types";
import { hashPassword } from "../../auth/password";
import { generateToken } from "../../auth/jwt";

interface RegisterEmployerResult {
  success: boolean;
  data?: {
    employer: {
      id: string;
      email: string;
      name: string;
      telegramChatId: string | null;
      telegramUsername: string | null;
      createdAt: Date;
    };
    token: string;
  };
  error?: string;
}

/**
 * Use Case: Регистрация нового работодателя
 * 
 * @param input - данные для регистрации (email, name, password)
 * @returns объект нового работодателя без пароля + JWT токен или ошибка
 */
export async function registerEmployer(
  input: CreateEmployerInput
): Promise<RegisterEmployerResult> {
  try {
    // Проверка, что email не занят
    const existingEmployer = await prisma.employer.findUnique({
      where: { email: input.email },
    });

    if (existingEmployer) {
      return {
        success: false,
        error: "Email уже используется",
      };
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword(input.password);

    // Создаем работодателя с хешированным паролем
    const employer = await prisma.employer.create({
      data: {
        ...input,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        telegramChatId: true,
        telegramUsername: true,
        createdAt: true,
      },
    });

    // Генерируем JWT токен
    const token = generateToken({
      employerId: employer.id,
      email: employer.email,
      name: employer.name,
    });

    return {
      success: true,
      data: {
        employer,
        token,
      },
    };
  } catch (error) {
    console.error("Ошибка в registerEmployer:", error);
    return {
      success: false,
      error: "Ошибка при регистрации работодателя",
    };
  }
}

