import { Request, Response } from 'express'
import { Users } from '../models/users'
import { createValidation, loginValidation, comparePassword, updateValidation } from '../validation/users'
import { createToken, validationToken } from '../validation/token'
interface ValidationToken {
    isError: boolean;
    value: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
}
export default class UserController {
    async index(request: Request, response: Response) {
        const token = request.headers['x-access-token'];
        const val: ValidationToken | any = validationToken(String(token));
        const validation: ValidationToken = val;
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value });
        }
        try {
            const result = await Users.find()
            return response.json({ message: 'success', value: result });
        } catch (e) {
            console.log(e)
            return response.json({ message: 'error', value: e });
        }

    }
    async create(request: Request, response: Response) {
        const validation = createValidation(request.body)
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value })
        }
        const token = createToken(String(validation.user?.email))
        try {
            const isExist = await Users.find({ email: validation.user?.email })
            if (isExist.length !== 0) {
                return response.json({ message: 'error', value: 'This user already exists' });
            }
            const userSaved: User | any = await new Users(validation.user).save()
            return response.json({
                message: 'success',
                value: {
                    id: userSaved._id,
                    name: userSaved.name,
                    email: userSaved.email
                },
                token
            })
        } catch (e) {
            console.log(e)
            return response.json({ message: 'error', value: e });
        }
    }
    async login(request: Request, response: Response) {
        const validation = loginValidation(request.body)
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value })
        }
        const compareResult = await comparePassword(String(validation.user?.email), String(validation.user?.password))
        if (compareResult.isError) {
            return response.json({ message: 'error', value: compareResult.value });
        }
        const token = createToken(String(validation.user?.email))
        return response.json({ message: 'success', value: compareResult.user, token: token });
    }

    async update(request: Request, response: Response) {
        const token = request.headers['x-access-token'];
        const val: ValidationToken | any = validationToken(String(token));
        const validation: ValidationToken = val;
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value });
        }
        const value = updateValidation(request.body)
        if (value.isError) {
            return response.json({ message: 'error', value: value.value })
        }
        try {
            Users.findOneAndUpdate({ _id: value.id }, {
                name: value.newValue?.name,
                email: value.newValue?.email
            })
            if (value.newValue?.password) {
                await Users.findOneAndUpdate({ _id: value.id }, {
                    password: value.newValue?.password
                })
            }

            return response.json({
                message: 'success',
                result: {
                    name: value.newValue?.name,
                    email: value.newValue?.email,
                    password: value.newValue?.password
                },
                token: createToken(String(value.newValue?.email))
            })

        } catch (e) {
            console.log(e)
            return response.json({ message: 'error', value: e });
        }

    }
}