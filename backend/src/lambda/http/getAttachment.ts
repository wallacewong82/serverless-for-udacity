// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import 'source-map-support/register'
// import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
//
// const XAWS = AWSXRay.captureAWS(AWS)
//
// const docClient = new XAWS.DynamoDB.DocumentClient()
//
// const attachmentsTable = process.env.ATTACHMENTS_TABLE
// const attachmentIdIndex = process.env.ATTACHMENT_ID_INDEX
//
// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   console.log('Caller event', event)
//   const attachmentId = event.pathParameters.attachmentId
//
//   const result = await docClient.query({
//       TableName : attachmentsTable,
//       IndexName : attachmentIdIndex,
//       KeyConditionExpression: 'attachmentId = :attachmentId',
//       ExpressionAttributeValues: {
//           ':attachmentId': attachmentId
//       }
//   }).promise()
//
//   if (result.Count !== 0) {
//     return {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*'
//       },
//       body: JSON.stringify(result.Items[0])
//     }
//   }
//
//   return {
//     statusCode: 404,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: ''
//   }
// }
