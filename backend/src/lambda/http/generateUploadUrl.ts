import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import {parseUserId } from '../../auth/utils'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const todosTable = process.env.TODOS_TABLE
const attachmentTable = process.env.ATTACHMENTS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event: ', event)
  const todoId = event.pathParameters.todoId
  console.log("todoId ", todoId)
  const validTodoId = await todoExists(todoId)

  if (!validTodoId){
    return{
      statusCode:404,
      headers:{
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }
  const oldTodoId = await retrieveOld(todoId)
  const attachmentId = uuid.v4()

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createAttachment(todoId, attachmentId, event, jwtToken, oldTodoId)


  const url = getUploadUrl(attachmentId)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // body: ''
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

async function todoExists(todoId: string){
  const result = await docClient
    .get({
      TableName: todosTable,
      Key:{
        todoId: todoId
      }
    })
    .promise()

    console.log('Get todo: ', result)
    return !!result.Item
}

async function createAttachment(todoId: string, attachmentId: string, event: any, jwtToken: string, oldTodoId:any) {
  const timestamp = new Date().toISOString()
  const newAttach = JSON.parse(event.body)

  const newItem = {
    todoId,
    timestamp,
    attachmentId,
    userId: parseUserId(jwtToken),
    ...newAttach,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${attachmentId}`

  }
  console.log('Storing new item: ', newItem)
  //this is backend where we can store the new url
  await docClient
    .put({
      TableName: attachmentTable,
      Item: newItem
    })
    .promise()

  const updatedItem = {
    todoId: todoId,
    userId: parseUserId(jwtToken),
    createdAt: oldTodoId.createdAt,
    name: oldTodoId.name,
    dueDate:oldTodoId.dueDate,
    done: oldTodoId.done,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
  }

  console.log("updateditem is ", updatedItem)

  await docClient.put({
    TableName: todosTable,
    Item: updatedItem
  }).promise()
  console.log("upload completed!")

  return newItem
}

function getUploadUrl(attachmentId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: 300
  })
}

async function retrieveOld(todoId: string){
  const result = await docClient.get({
    TableName: todosTable,
    Key:{
      todoId: todoId
    }
  }).promise()

  return result.Item
}
