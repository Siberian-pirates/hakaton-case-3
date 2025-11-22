import { PrismaClient } from "@prisma/client";

// Инициализация Prisma Client с учетом hot-reload в Next.js
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Используем глобальную переменную в development для предотвращения создания множества инстансов
// при hot-reload в Next.js
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
