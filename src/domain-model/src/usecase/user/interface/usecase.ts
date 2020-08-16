import { CreateUserRequest, UpdateUserRolesRequest } from 'schema/types';

interface UserUseCase<Request> {
  handle(request: Request): void;
}

export type GetUserUseCase = UserUseCase<string>;

export type CreateUserUseCase = UserUseCase<CreateUserRequest>;
export type UpdateUserRolesUseCase = UserUseCase<UpdateUserRolesRequest>;
