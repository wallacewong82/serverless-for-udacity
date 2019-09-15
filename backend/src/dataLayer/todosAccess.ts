import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
// import {parseUserId } from '../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todos')
    //
    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()

    // const authorization = this.event.headers.Authorization
    // const split = authorization.split(' ')
    // const jwtToken = split[1]
    //
    // var params = {
    //   TableName: this.todosTable,
    //   ExpressionAttributeValues:{
    //     ":userId": parseUserId(jwtToken)
    //   }
    // };

    // const result = await this.docClient.scan(params).promise()
    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
