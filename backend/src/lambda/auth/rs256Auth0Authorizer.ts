
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJCh7NLXK0897eMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi01amlnZmc2cy5hdXRoMC5jb20wHhcNMTkwODI3MTUzNTQyWhcNMzMw
NTA1MTUzNTQyWjAhMR8wHQYDVQQDExZkZXYtNWppZ2ZnNnMuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0bxaR23or3Z1OAVRTwEovWg
MOqWgaDseObTp4N5YIoDCTaLWeYfBdckmQ8YokMw0ktf65Z6ieHYVzPE7ckxYSkw
LtrgV5zXI6NhgIZV8wHt3C1iCUVbrNY9kMEHjI8I6pSO5XdTot9SUqnVM/EGsyw/
zclGnE0Ihrs8VsYvcQafiRd/bt3woKAs+SFE3JIhIs42UA3EuG3ciyDu6xnwPyft
bIKRzfZ1NI46b8Rh+LCAEaA6O/TNoAj98schMMRrY3/nOMiL3CKqImva6PCP3LmA
cbOF6Y+yOyCXwtAyeOBJNNA3oZCqj1xsE6ZraMlaI0sYmZ6zKkfPGHy8r8IGHwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBThre7RnDAx0bYaSZbL
06V2rAGsBzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBABAdirnV
X6hi6u81CxTD6BjEAwZ8csAqnexst0GDZ4OLrGoQLwc86TNkQXQ1iML8TyE1knV7
ldEioEkeGV5XP2B6UXClo5otbvDrZxnstUgqCH9tHsfKaHyNhmq5/k5qN60uEK9o
LmFYi8MdY24SCWsxLZ1On0WHzrT8aF1txa+MCqqNCOy/tT+uprQ75JzZtQCwFJzg
v/5c/++BVjDyKWNi3nf3HSSRZc0nAW6XiEY69RkwCojT3HF8/IdFe3mIUSlSf62l
uUgZcigyIdxyE4h8n4/kDP62vEuH4BHDZWxE6YzvARTvz85Rgavnfec6nZ33xDtv
CGqgs3XtLYj3lwk=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
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
    console.log('User authorized', e.message)

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

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
