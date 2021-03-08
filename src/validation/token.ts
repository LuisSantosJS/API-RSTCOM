import jwt from 'jsonwebtoken'
const key = 'chavesecretas'
const createToken = (email: string) => {
    const token = jwt.sign(email, key)
    return token
}
const validationToken = (token: string) => {
    return jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return { isError: true, value: 'Invalid token' }
        }
        return { isError: false, value: 'Valid token' }
    });
}
export { createToken, validationToken }