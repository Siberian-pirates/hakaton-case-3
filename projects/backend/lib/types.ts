import { z } from "zod";

// Определяем enum локально, т.к. Prisma Client еще не сгенерирован
// После генерации Prisma Client можно будет использовать из @prisma/client
export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// Экспортируем также как type для совместимости
export type ApplicationStatusType = ApplicationStatus;

// ============================================
// Zod схемы для валидации
// ============================================

// Схема для создания работодателя
export const CreateEmployerSchema = z.object({
  email: z.email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  telegramUsername: z.string().optional(),
  telegramChatId: z.string().optional(),
});

// Схема для обновления работодателя
export const UpdateEmployerSchema = z.object({
  email: z.email("Некорректный email").optional(),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").optional(),
  telegramUsername: z.string().optional(),
  telegramChatId: z.string().optional(),
});

// Схема для создания вакансии
export const CreateVacancySchema = z.object({
  title: z.string().min(3, "Название должно содержать минимум 3 символа"),
  description: z
    .string()
    .min(10, "Описание должно содержать минимум 10 символов"),
  requirements: z.string().optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().default(true),
  employerId: z.uuid("Некорректный ID работодателя"),
  tags: z.array(z.uuid("Некорректный ID тега")).optional(), // Массив ID тегов
});

// Схема для обновления вакансии
export const UpdateVacancySchema = z.object({
  title: z
    .string()
    .min(3, "Название должно содержать минимум 3 символа")
    .optional(),
  description: z
    .string()
    .min(10, "Описание должно содержать минимум 10 символов")
    .optional(),
  requirements: z.string().optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.uuid("Некорректный ID тега")).optional(),
});

// Схема для создания тега
export const CreateTagSchema = z.object({
  name: z.string().min(2, "Название тега должно содержать минимум 2 символа"),
  slug: z
    .string()
    .min(2, "Slug должен содержать минимум 2 символа")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug может содержать только строчные буквы, цифры и дефисы"
    ),
});

// Схема для создания отклика
export const CreateApplicantSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.email("Некорректный email"),
  phone: z.string().optional(),
  telegramUsername: z.string().optional(),
  resume: z.string().optional(),
  coverLetter: z.string().optional(),
  vacancyId: z.uuid("Некорректный ID вакансии"),
});

// Схема для обновления статуса отклика
export const UpdateApplicantStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"], {
    message: "Некорректный статус",
  }),
});

// Схема для авторизации работодателя
export const LoginEmployerSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});

// Схема для фильтрации вакансий
export const FilterVacanciesSchema = z.object({
  tags: z.array(z.string()).optional(), // Массив slug'ов тегов
  search: z.string().optional(), // Поиск по названию и описанию
  isActive: z.boolean().optional(),
  employerId: z.uuid().optional(),
});

// ============================================
// TypeScript типы
// ============================================

// Типы для создания/обновления
export type CreateEmployerInput = z.infer<typeof CreateEmployerSchema>;
export type UpdateEmployerInput = z.infer<typeof UpdateEmployerSchema>;
export type CreateVacancyInput = z.infer<typeof CreateVacancySchema>;
export type UpdateVacancyInput = z.infer<typeof UpdateVacancySchema>;
export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type CreateApplicantInput = z.infer<typeof CreateApplicantSchema>;
export type UpdateApplicantStatusInput = z.infer<
  typeof UpdateApplicantStatusSchema
>;
export type LoginEmployerInput = z.infer<typeof LoginEmployerSchema>;
export type FilterVacanciesInput = z.infer<typeof FilterVacanciesSchema>;

// Типы для ответов API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Типы для Telegram уведомлений
export interface TelegramNotificationData {
  chatId: string;
  message: string;
  parseMode?: "HTML" | "Markdown";
}

// Типы для Email уведомлений
export interface EmailNotificationData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Типы для уведомлений об изменении статуса
export interface StatusChangeNotification {
  applicantName: string;
  applicantEmail: string;
  applicantTelegramChatId?: string | null;
  vacancyTitle: string;
  oldStatus?: ApplicationStatusType;
  newStatus: ApplicationStatusType;
}

// Типы для уведомлений работодателю о новом отклике
export interface NewApplicantNotification {
  employerName: string;
  employerTelegramChatId?: string | null;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string | null;
  vacancyTitle: string;
  applicantId: string;
}
