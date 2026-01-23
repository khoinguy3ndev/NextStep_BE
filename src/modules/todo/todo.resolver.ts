import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { Todo } from 'src/entities/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/createTodoInput.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Todo)
  async getTodoById(@Args('todoId') todoId: number, @CurrentUser() user: User): Promise<Todo> {
    return this.todoService.findTodoById(todoId, user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Todo])
  async getTodos(@CurrentUser() user: User): Promise<Todo[]> {
    return this.todoService.findAllTodos(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Todo)
  async createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInput, @CurrentUser() user: User ): Promise<Todo> {
    return this.todoService.createTodo(createTodoInput, user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Todo)
  async updateTodoStatus(@Args('todoId') todoId: number, @CurrentUser() user: User): Promise<Todo> {
    return this.todoService.toggleTodoStatus(todoId, user.userId);
  }
}

/**
 *
 *
 * CREATE TODO TESTING MUTATION
{
  "query": "mutation CreateTodo($createTodoInput: CreateTodoInput!) { createTodo(createTodoInput: $createTodoInput) { todoId, title, description, startDate, endDate, completed, createdAt, user { userId } } } ",
  "variables": {
    "createTodoInput": {
      "title": "Learn GraphQL",
      "description": "Enouvo IT Solutions",
      "startDate": "2026-01-15T08:00:00.000Z",
      "endDate": "2026-01-16T08:00:00.000Z"
    }
  }
}

  GET TODO BY ID TESTING QUERY
  {
    "query": "query GetTodo($todoId: Float!) { getTodoById(todoId: $todoId) { todoId, title, description, startDate, endDate, completed, createdAt, user { userId } } } ",
    "variables": {
      "todoId": 1
    }
  }

  {
    "query": "mutation UpdateStatus($todoId: Float!) { updateTodoStatus(todoId: $todoId) { todoId, completed, createdAt, user { userId } } } ",
    "variables": {
      "todoId": 3
    }
  }

  {
    "query": "query GetTodos { getTodos { todoId, title, description, startDate, endDate, completed, createdAt } }"
  }

 */