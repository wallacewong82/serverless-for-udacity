import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {parseUserId } from '../../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const userIdIndex = process.env.USERID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing event: ', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]


  // var params = {
  //   TableName: todosTable,
  //   FilterExpression: "#userId = :userId",
  //   ExpressionAttributeNames:{
  //     "#userId": "userId",
  //   },
  //   ExpressionAttributeValues:{
  //     ":userId": parseUserId(jwtToken)
  //   }
  // };
  //
  // const result = await docClient.scan(params).promise()

  const result = await docClient.query({
      TableName : todosTable,
      IndexName : userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': parseUserId(jwtToken)
      },

      ScanIndexForward: false
  }).promise()

  const items = result.Items

  return {
    statusCode:200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
