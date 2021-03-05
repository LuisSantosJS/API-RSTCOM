import * as EmailValidator from 'email-validator';
import bcrypt from 'bcrypt'
import { Users } from '../models/users'
interface BodyCreate {
    name: string;
    email: string;
    password: string;
}

interface LoginCreate {
    email: string;
    password: string;
}
interface UpdateValidation {
    id: string;
    password?: string;
    email: string;
    name: string;
}

const createValidation = (body: BodyCreate) => {
    if (!body) {
        return { isError: true, value: 'No body' }
    }
    if ((String(body.name).length === 0) || !body.name) {
        return { isError: true, value: 'The $name parameter is missing from the request body' }
    }
    if (!EmailValidator.validate(body.email)) {
        return { isError: true, value: 'Email is not valid' }
    }
    if ((String(body.email).length === 0) || !body.email) {
        return { isError: true, value: 'The $email parameter is missing from the request body' }
    }
    if ((String(body.password).length === 0) || !body.password) {
        return { isError: true, value: 'The $password parameter is missing from the request body' }
    }
    if ((String(body.password).length < 8) || !body.password) {
        return { isError: true, value: 'Password too short, enter at least 8 characters' }
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password, salt);
    return {
        isError: false,
        user: {
            name: body.name,
            email: String(body.email).toLowerCase(),
            password: hash
        } as BodyCreate
    }
}

const loginValidation = (body: LoginCreate) => {
    if (!body) {
        return { isError: true, value: 'No body' }
    }
    if (!EmailValidator.validate(body.email)) {
        return { isError: true, value: 'Email is not valid' }
    }
    if ((String(body.email).length === 0) || !body.email) {
        return { isError: true, value: 'The $email parameter is missing from the request body' }
    }
    if ((String(body.password).length === 0) || !body.password) {
        return { isError: true, value: 'The $password parameter is missing from the request body' }
    }

    return {
        isError: false,
        user: {
            email: body.email,
            password: body.password
        } as BodyCreate
    }
}

const comparePassword = async (email: string, password: string) => {
    const isExist: any = await Users.find({ email: String(email).toLowerCase() }).limit(1)
    if (isExist.length === 0) {
        return { isError: true, value: 'non-existent user' }
    }
    const password_hash: string = isExist[0].password;
    const isValidPassword = bcrypt.compareSync(password, password_hash);
    if (!isValidPassword) {
        return { isError: true, value: 'Incorrect password' }
    }
    return {
        isError: false,
        user: {
            id: isExist[0]._id,
            name: isExist[0].name,
            email: isExist[0].email
        }
    }
}
const updateValidation = (body: UpdateValidation) => {
    if ((String(body.id).length === 0) || !body.id) {
        return { isError: true, value: 'The $id parameter is missing from the request body' }
    }
    if ((String(body.email).length === 0) || !body.email) {
        return { isError: true, value: 'The $.email parameter is missing from the request body' }
    }
    if ((String(body.name).length === 0) || !body.name) {
        return { isError: true, value: 'The $.name parameter is missing from the request body' }
    }
    if (body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.password, salt);
        return {
            isError: false,
            id: body.id,
            newValue: {
                email: body.email,
                name: body.name,
                password: hash
            }
        }
    } else {
        return {
            isError: false,
            id: body.id,
            newValue: {
                email: body.email,
                name: body.name
            }
        }
        
    }



}

export {
    createValidation,
    loginValidation,
    comparePassword,
    updateValidation
} 