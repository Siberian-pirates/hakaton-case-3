// TODO: Установить пакеты: yarn add bcryptjs @types/bcryptjs
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Хеширование пароля
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Сравнение пароля с хешем
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

