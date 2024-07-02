import { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../config/firebaseConfig'

const authenticate = async (
  req: VercelRequest,
  res: VercelResponse,
  next: Function,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await auth.verifyIdToken(idToken)
    ;(req as any).user = decodedToken
    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Invalid token', error: error.message })
  }
}

export default authenticate
