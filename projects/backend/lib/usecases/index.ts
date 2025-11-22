// Экспорт всех Use Cases

// Auth
export { loginEmployer } from "./auth/loginEmployer";
export { registerEmployer } from "./auth/registerEmployer";

// Vacancies
export {
  createVacancy,
  updateVacancy,
  deleteVacancy,
  getVacancyById,
  getVacanciesByEmployer,
  getPublicVacancies,
} from "./vacancies";

// Applicants
export {
  getApplicantsByEmployer,
  getApplicantById,
  createApplicant,
  updateApplicantStatus,
} from "./applicants";

// Tags
export { getAllTags, createTag } from "./tags";

