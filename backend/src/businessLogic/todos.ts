import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)
  const mydate = new Date()
  const newdate = mydate.setDate(mydate.getDate()+7).toString()
  return await todoAccess.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: mydate.toISOString(),
    name: createTodoRequest.name,
    dueDate: newdate,
    done: false,
    attachmentUrl: "www.image.com/cats.jpg"
  })
}
