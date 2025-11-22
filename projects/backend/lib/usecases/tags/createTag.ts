import prisma from "../../prisma";
import type { CreateTagInput } from "../../types";

/**
 * Use Case: Создать новый тег
 * 
 * @param input - данные тега (name, slug)
 * @returns созданный тег
 */
export async function createTag(input: CreateTagInput) {
  try {
    // Проверка уникальности slug
    const existingTag = await prisma.tag.findUnique({
      where: { slug: input.slug },
    });

    if (existingTag) {
      return {
        success: false,
        error: "Тег с таким slug уже существует",
      };
    }

    // Создаем тег
    const tag = await prisma.tag.create({
      data: input,
    });

    return {
      success: true,
      data: tag,
    };
  } catch (error) {
    console.error("Ошибка в createTag:", error);
    return {
      success: false,
      error: "Ошибка при создании тега",
    };
  }
}

