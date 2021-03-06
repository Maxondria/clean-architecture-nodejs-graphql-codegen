import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TodoEntity, TodoDto, TodoStatus } from 'domain-model';

import { User } from '../../user/entity/User';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'ownerId' })
  owner?: User;

  @Column()
  title: string;

  @Column()
  status: string;

  @Column('datetime', { default: null })
  dueDate?: Date | null = null;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;

  constructor(ownerId: number, title: string, status: string) {
    this.ownerId = ownerId;
    this.title = title;
    this.status = status;
  }
}

export class OrmTodoFactory {
  public static fromDto(todo: TodoDto): Todo {
    return {
      id: +todo.id,
      ownerId: +todo.ownerId,
      title: todo.title,
      status: todo.status,
      dueDate: todo.dueDate,
      createdAt: todo.createdAt ?? undefined,
      updatedAt: todo.updatedAt ?? undefined,
    };
  }

  public static fromEntity(todoEntity: TodoEntity) {
    const todoSchema = todoEntity.toDto();
    return OrmTodoFactory.fromDto(todoSchema);
  }

  public static toDto(todo: Todo): TodoDto {
    return {
      id: `${todo.id}`,
      ownerId: `${todo.ownerId}`,
      title: todo.title,
      status: todo.status as TodoStatus,
      dueDate: todo.dueDate,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }

  public static toEntity(todo: Todo): TodoEntity {
    const schema = OrmTodoFactory.toDto(todo);
    return new TodoEntity(schema);
  }
}
