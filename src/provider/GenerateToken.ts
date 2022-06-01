import authConfig from '../config/auth'
import jwt from 'jsonwebtoken'

class GenerateToken {
  async execute (id: string, role:string) {
    const token = jwt.sign({ id, role }, authConfig.secret, {
      expiresIn: authConfig.expiresIn
    })
    return token
  }
}

export default GenerateToken
