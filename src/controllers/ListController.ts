import {
    Request,
    Response
} from 'express'
import {
    validationToken
} from '../validation/token'
import {
    List
} from '../models/list'
import {
    indexValidation,
    createValidation,
    updateValidation,
    deleteValidation
} from '../validation/list'

interface ValidationToken {
    isError: boolean;
    value: string;
}
interface Params {
    userID: string;
}

interface Lists {
    _id: string;
    title: string;
    description: string;
    isComplete: boolean;
}
interface Lists2 {
    id: string;
    title: string;
    description: string;
    isComplete: boolean;
}

export default class UserController {
    async index(request: Request, response: Response) {
        const token = request.headers['x-access-token'];
        const params: Params | any = request.params
        const val: ValidationToken | any = validationToken(String(token));
        const validationTokens: ValidationToken = val;
        if (validationTokens.isError) {
            return response.json({ message: 'error', value: validationTokens.value });
        }
        const validation = indexValidation(params)
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value })
        }
        var resultResponse: Lists2[] = []
        try {

            const result: Lists[] | any = await List.find({ userID: validation.userID })
            result.map((res: Lists) => {
                resultResponse.push({
                    id: res._id,
                    title: res.title,
                    description: res.description,
                    isComplete: res.isComplete
                } as Lists2)
            })
            return response.json({ message: 'success', value: resultResponse })
        } catch (error) {
            return response.json({ message: 'error', value: error })
        }
    }
    async create(request: Request, response: Response) {
        const token = request.headers['x-access-token'];
        const val: ValidationToken | any = validationToken(String(token));
        const validationTokens: ValidationToken = val;
        if (validationTokens.isError) {
            return response.json({ message: 'error', value: validationTokens.value });
        }
        const validation = createValidation(request.body)
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value })
        }
        try {
            const result: any = await new List({ ...validation.list, isComplete: false }).save()
            return response.json({
                message: 'success',
                value: {
                    id: result._id,
                    title: result.title,
                    description: result.description
                }
            })
        } catch (error) {
            return response.json({ message: 'error', value: error })
        }

    }
    async delete(request: Request, response: Response) {
        const token = request.headers['x-access-token'];
        const val: ValidationToken | any = validationToken(String(token));
        const validationTokens: ValidationToken = val;
        if (validationTokens.isError) {
            return response.json({ message: 'error', value: validationTokens.value });
        }
        const params: any = request.params
        const validation = deleteValidation(params);
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value })
        }
        try {
            const result = await List.findByIdAndDelete(validation.list?.id)
            return response.json({ message: 'success', value: result })
        } catch (error) {
            return response.json({ message: 'error', value: error })
        }

    }
    async update(request: Request, response: Response) {
        const token = request.headers['x-access-token'];
        const val: ValidationToken | any = validationToken(String(token));
        const validationTokens: ValidationToken = val;
        if (validationTokens.isError) {
            return response.json({ message: 'error', value: validationTokens.value });
        }
        const validation = updateValidation(request.body);
        if (validation.isError) {
            return response.json({ message: 'error', value: validation.value })
        }

        try {
            const result = await List.findOneAndUpdate(
                {
                    _id: validation.list?.id
                },
                {
                    isComplete: Boolean(validation.list?.isComplete)
                }
            )

            const itemList: Lists2[] | any = await List.find({ _id: result?._id }).limit(1)
            const resultList = {
                id: itemList[0]._id,
                description: itemList[0].description,
                isComplete: itemList[0].isComplete,
                title: itemList[0].title
            }


            return response.json({ message: 'success', value: resultList })
        } catch (error) {
            console.log(error)
            return response.json({ message: 'error', value: error })
        }


    }


}