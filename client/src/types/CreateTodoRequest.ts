export interface CreateTodoRequest {
  name: string
  dueDate: string
  createdAt: string
  done: boolean
  attachmentUrl?: string
}
