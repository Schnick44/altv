import { verify } from 'jsonwebtoken'

const APP_SECRET = 'appsecret321'

export function getUserId(context) {
  const authHeader = context.req.get('Authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET)
    return verifiedToken && Number(verifiedToken.userId)
  }
}
