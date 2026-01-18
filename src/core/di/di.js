// Import Repository
import { AuthRepository } from "../../features/auth/data/repository/AuthRepository";
import { BudgetRepository } from "../../features/budgeting/data/repository/BudgetRepository";
import { NoteRepository } from "../../features/notes/data/repository/NoteRepository";
import { CoupleRepository } from "../../features/couple/data/repository/CoupleRepository";
import { WaBotRepository } from "../../features/wabot/data/repository/WaBotRepository";
import { SecurityRepository } from "../../features/security/data/repository/SecurityRepository";

// Import Use Cases
import { LoginUserUseCase } from "../../features/auth/domain/use-cases/LoginUserUseCase";
import { RegisterUserUseCase } from "../../features/auth/domain/use-cases/RegisterUserUseCase";
import { GetCurrentUserUseCase } from "../../features/auth/domain/use-cases/GetCurrentUserUseCase";
import { LogoutUserUseCase } from "../../features/auth/domain/use-cases/LogoutUserUseCase";
import { GetProfileUseCase } from "../../features/auth/domain/use-cases/GetProfileUseCase";

import { GetDashboardSummaryUseCase } from "../../features/budgeting/domain/use-cases/GetDashboardSummaryUseCase";
import { GetCategoriesUseCase } from "../../features/budgeting/domain/use-cases/GetCategoriesUseCase";
import { CreateTransactionUseCase } from "../../features/budgeting/domain/use-cases/CreateTransactionUseCase";
import { GetTransactionsListUseCase } from "../../features/budgeting/domain/use-cases/GetTransactionsListUseCase";
import { GetTransactionDetailUseCase } from "../../features/budgeting/domain/use-cases/GetTransactionDetailUseCase";
import { UpdateTransactionUseCase } from "../../features/budgeting/domain/use-cases/UpdateTransactionUseCase";
import { DeleteTransactionUseCase } from "../../features/budgeting/domain/use-cases/DeleteTransactionUseCase";
import { GetSpendingTrendUseCase } from "../../features/budgeting/domain/use-cases/GetSpendingTrendUseCase";
import { GetAiAdviceUseCase } from "../../features/budgeting/domain/use-cases/GetAiAdviceUseCase";

import { GetNotesUseCase } from "../../features/notes/domain/use-cases/GetNotesUseCase";
import { GetNoteByIdUseCase } from "../../features/notes/domain/use-cases/GetNoteByIdUseCase";
import { CreateNoteUseCase } from "../../features/notes/domain/use-cases/CreateNoteUseCase";
import { UpdateNoteUseCase } from "../../features/notes/domain/use-cases/UpdateNoteUseCase";
import { DeleteNoteUseCase } from "../../features/notes/domain/use-cases/DeleteNoteUseCase";
import { GetPublicNoteUseCase } from "../../features/notes/domain/use-cases/GetPublicNoteUseCase";
import { UpdateNotePermissionsUseCase } from "../../features/notes/domain/use-cases/UpdateNotePermissionsUseCase";

import { GetCoupleStatusUseCase } from "../../features/couple/domain/use-cases/GetCoupleStatusUseCase";
import { ConnectCoupleUseCase } from "../../features/couple/domain/use-cases/ConnectCoupleUseCase";

import { RegisterBotUseCase } from "../../features/wabot/domain/use-cases/RegisterBotUseCase";
import { GetGroupsUseCase } from "../../features/wabot/domain/use-cases/GetGroupsUseCase";
import { SendMessageUseCase } from "../../features/wabot/domain/use-cases/SendMessageUseCase";

import { ChangePasswordUseCase } from "../../features/security/domain/use-cases/ChangePasswordUseCase";

// --- Singleton Instances ---

// 1. Repositories
const authRepository = new AuthRepository();
const budgetRepository = new BudgetRepository();
const noteRepository = new NoteRepository();
const coupleRepository = new CoupleRepository();
const waBotRepository = new WaBotRepository();
const securityRepository = new SecurityRepository();

// 2. Use Cases (Injected with Repository)
export const loginUserUseCase = new LoginUserUseCase(authRepository);
export const registerUserUseCase = new RegisterUserUseCase(authRepository);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
export const logoutUserUseCase = new LogoutUserUseCase(authRepository);
export const getProfileUseCase = new GetProfileUseCase(authRepository);

export const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase(budgetRepository);
export const getCategoriesUseCase = new GetCategoriesUseCase(budgetRepository);
export const createTransactionUseCase = new CreateTransactionUseCase(budgetRepository);
export const getTransactionsListUseCase = new GetTransactionsListUseCase(budgetRepository);
export const getTransactionDetailUseCase = new GetTransactionDetailUseCase(budgetRepository);
export const updateTransactionUseCase = new UpdateTransactionUseCase(budgetRepository);
export const deleteTransactionUseCase = new DeleteTransactionUseCase(budgetRepository);
export const getSpendingTrendUseCase = new GetSpendingTrendUseCase(budgetRepository);
export const getAiAdviceUseCase = new GetAiAdviceUseCase(budgetRepository);

export const getNotesUseCase = new GetNotesUseCase(noteRepository);
export const getNoteByIdUseCase = new GetNoteByIdUseCase(noteRepository);
export const createNoteUseCase = new CreateNoteUseCase(noteRepository);
export const updateNoteUseCase = new UpdateNoteUseCase(noteRepository);
export const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);
export const getPublicNoteUseCase = new GetPublicNoteUseCase(noteRepository);
export const updateNotePermissionsUseCase = new UpdateNotePermissionsUseCase(noteRepository);

export const getCoupleStatusUseCase = new GetCoupleStatusUseCase(coupleRepository);
export const connectCoupleUseCase = new ConnectCoupleUseCase(coupleRepository);

export const registerBotUseCase = new RegisterBotUseCase(waBotRepository);
export const getGroupsUseCase = new GetGroupsUseCase(waBotRepository);
export const sendMessageUseCase = new SendMessageUseCase(waBotRepository);

export const changePasswordUseCase = new ChangePasswordUseCase(securityRepository);

// Export repository if needed elsewhere (though relying on use cases is better)
export { authRepository, budgetRepository, noteRepository, coupleRepository, waBotRepository, securityRepository };
