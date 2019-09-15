/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl: string

}
