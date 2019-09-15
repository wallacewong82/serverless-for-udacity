// import 'source-map-support/register'
// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
//
// const XAWS = AWSXRay.captureAWS(AWS)
//
// const docClient = new XAWS.DynamoDB.DocumentClient()
//
// const todosTable = process.env.TODOS_TABLE
// const attachmentsTable = process.env.ATTACHMENTS_TABLE
//
// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // TODO: Get all TODO items for a current user
//   console.log('Processing event: ', event)
//   const todoId = event.pathParameters.todoId
//   const validTodoId = await todoExists(todoId)
//
//   if (!validTodoId){
//     return{
//       statusCode:404,
//       headers:{
//         'Access-Control-Allow-Origin': "*"
//       },
//       body: JSON.stringify({
//         error: 'Todo does not exist'
//       })
//     }
//   }
//
//   const result = await docClient.query({
//       TableName : attachmentsTable,
//       KeyConditionExpression: 'todoId = :todoId',
//       ExpressionAttributeValues: {
//           ':todoId': todoId
//       },
//       ScanIndexForward: false
//   }).promise()
//
//
//   return {
//     statusCode:200,
//     headers:{
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       items: result
//     })
//   }
// }
//
// async function todoExists(todoId: string){
//   const result = await docClient
//     .get({
//       TableName: todosTable,
//       Key:{
//         todoId: todoId
//       }
//     })
//     .promise()
//
//     console.log('Get todo: ', result)
//     return !!result.Item
// }
