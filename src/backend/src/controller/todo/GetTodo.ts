import { GetTodoUseCase } from '../../usecase/todo/usecase.interface';

export class GetTodoController {
  private createTodoUseCase: GetTodoUseCase;

  constructor(createTodoUseCase: GetTodoUseCase) {
    this.createTodoUseCase = createTodoUseCase;
  }

  public async handle(id: string) {
    await this.createTodoUseCase.handle(id);
  }
}