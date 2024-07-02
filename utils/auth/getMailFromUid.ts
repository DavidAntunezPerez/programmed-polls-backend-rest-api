import { auth } from '../../config/firebaseConfig'

async function getMailFromUid(userId: string): Promise<string> {
  try {
    const userRecord = await auth.getUser(userId)
    return userRecord.email || `No email found, userUID: ${userId}`
  } catch (error) {
    console.error('Error fetching user email:', error)
    return `Error fetching email, userUID: ${userId}`
  }
}

export default getMailFromUid
