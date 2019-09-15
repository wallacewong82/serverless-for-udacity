import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'
//
import {verify } from 'jsonwebtoken'
import {JwtToken} from '../../auth/JwtToken'
// import {Jwt} from '../../auth/Jwt'
//
const auth0Secret = process.env.AUTH_0_SECRET
// import { verify, decode } from 'jsonwebtoken'
// import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
// import { JwtPayload } from '../../auth/JwtPayload'
//
// const logger = createLogger('auth')
//
// const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

// export const handler = async (  event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
export const handler: CustomAuthorizerHandler = async(event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

  // logger.info('Authorizing a user', event.authorizationToken)
  try {
    // const jwtToken = await verifyToken(event.authorizationToken)
    // logger.info('User was authorized', jwtToken)
    const decodedToken = verifyToken(event.authorizationToken)
    console.log('user was authorized A: ', decodedToken)

    return {
      principalId: decodedToken.sub,
      // principalId: 'user',
      // principalId: decodedToken.payload.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    // logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}


function verifyToken (authHeader:string) : JwtToken{
// function verifyToken (authHeader:string){
    if (!authHeader)
        throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')

    console.log(authHeader)
    const split = authHeader.split(' ')
    const token = split[1]
    //
    //
    return verify(token, auth0Secret) as JwtToken
    // if (token != '123')
    //   throw new Error('Invalid token')
}
//

// async function verifyToken(authHeader: string): Promise<JwtPayload> {
//   const token = getToken(authHeader)
//   const jwt: Jwt = decode(token, { complete: true }) as Jwt
//
//   if (!authHeader)
//       throw new Error('No authentication header')
//
//   if (!authHeader.toLowerCase().startsWith('bearer '))
//     throw new Error('Invalid authentication header')
//   // TODO: Implement token verification
//
//   console.log(secret)
//   const split = authHeader.split(' ')
//   const token = split[1]
//   console.log(token)
//   console.log('hi')
//
//   return verify(token, secret) as JwtToken
// }
//
// function getToken(authHeader: string): string {
//   if (!authHeader) throw new Error('No authentication header')
//
//   if (!authHeader.toLowerCase().startsWith('bearer '))
//     throw new Error('Invalid authentication header')
//
//   const split = authHeader.split(' ')
//   const token = split[1]
//
//   return token
// }
