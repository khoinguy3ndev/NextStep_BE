import { EntityManager, t } from '@mikro-orm/postgresql';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoInput } from './dto/createTodoInput.input';
import { Todo } from 'src/entities/todo.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    private readonly em: EntityManager
  ) {}

  async createTodo(createInputTodo: CreateTodoInput, userId: number): Promise<Todo> {
    const { title, description, startDate, endDate } = createInputTodo;
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    const user = await this.em.findOne(User, { userId: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newTodo = this.em.create(Todo, {
      title,
      description,
      startDate,
      endDate,
      user,
    });
    await this.em.persistAndFlush(newTodo);
    return newTodo;
  }

  async findAllTodos(userId: number): Promise<Todo[]> {
    const todos = await this.em.find(Todo, { user: { userId: userId } }, { populate: ['user'] });
    return todos;
  }

  async findTodoById(todoId: number, userId: number): Promise<Todo> {
    const todo = await this.em.findOne(Todo, { todoId: todoId }, { populate: ['user'] });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    
    if (todo.user.userId !== userId) {
      throw new ForbiddenException('You are not allowed to access this todo');
    }
    
    return todo;
  }

  async toggleTodoStatus(todoId: number, userId: number): Promise<Todo> {
    const todo = await this.em.findOne(Todo, { todoId: todoId }, { populate: ['user'] });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if (todo.user.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this todo');
    }
    if (todo.completed === false) todo.completed = true;
    else todo.completed = false;
    await this.em.persistAndFlush(todo);
    return todo;
  }
}
