import * as EmailValidator from 'email-validator';
import bcrypt from 'bcrypt'
import { Users } from '../models/users'

const DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOCAYAAACOqiAdAAAABHNCSVQICAgIfAhkiAAACU5JREFUeF7tnAWM1cwWgM/i7h7cg4YAIbi7EwguwV2CQyB4ggX34MFdghMIBHcI7hrcXV++yesf3r7u3ba307Lsf5KbvbvbTqdfT2fm2IT8+vXrl/gkXPr79+/y5s0befLkiVy/fl3u3Lmjvn/8+FH4f5w4cSRVqlSSIUMGyZo1q/qeMGFCiR49uoSEhPjUc5EQr8EZz+nLly9y7NgxWb9+vZw8eVJu3rypAH7+/NkURsyYMRWwzJkzS8GCBaVOnTpSrFgxBdYP8RwcGnbjxg0ZNmyYbNy4UQDoRNC46tWry8iRIyVnzpwSLVo0J804PsdTcGjUrFmzZMaMGfLgwQPHnf79xBQpUkinTp2kR48ekjhxYlfatNKIZ+CePn0qrVu3lp07d6pxzU2JGjWqlCxZUpYtWyapU6f2ZOzzBNyzZ8+URqxcuVIN+LqkZs2aSpvTpk2rLqFz8tAKDkifPn2SNm3ayNq1a13XtNAPgHGOcW/JkiUSP378iAnOWGrMnDlTevXqpVXTQgMcPny49O/fX5iJdYk2jQMc67JatWrJ1atXdfXftN306dPLunXrpFChQtquqw3cz58/1VOfOHGip9pmkGrbtq3MmTNHokSJogWeFnCGtpUqVUpZAX5IkiRJZM+ePVKgQAEtl9cGbsSIEWqR66d07txZpk2bpkXrtIB7/fq11K9fX/bu3esnN6Vt27dvl5QpU7reDy3grly5IlWrVlUGu5+SLFky2bp1qxQpUsT1bmgBt2vXLmnQoIG8ffvW9Q7baTB27NiyYMECadSokZ3TLB2rBdzChQulY8eO8vXrV0ud0HUQptiYMWOkX79+rl9CCzgmBSYHneaVVRJdu3ZVE4TbogVcz549ZcqUKW731VF7LVu2lEWLFjk6N9BJWsDh5pk9e7brnXXSILP7mjVrnJwa8Bwt4Dp06CBz5851vbNOGqxdu7ZymLotWsB16dJFMO7/BGnYsKFyZ7ktWsBho44bN87tvjpqD5t13rx5js71fIybPHmy9OnTR378+OF6h+00iCNz4MCBMnr0aDunWTpWi8bhtGzRooVyYvopMWLEkKlTpwpjrtuiBdzhw4eVH+7Fixdu99dWe/HixZNVq1ZJtWrVbJ1n5WAt4G7fvi1VqlSRa9euWemDtmPSpEkjmH+5c+d2/RpawH348EGaNGkimzdvdr3DdhosUaKEbNmyRRIlSmTnNEvHagGHqcWAPGTIEEud0HVQ9+7dZdKkSRHHHweI06dPS+nSpeX9+/e6uARsF88Irylap0O0aBwdxTNCfgeORD+EADXgYsWKpeXy2sDRWyLrRO+9di+RV8IrigWjS7SCu3fvntSoUUMuXLigq/+m7ZIOxqRAMo4u0QqOHBGCw6NGjdLVf9N2u3XrJhMmTBAWwLpEKzhmV+IP5cqVk8ePH+u6h/9pN3ny5LJ7927Jly9fxEyB+P1uSIQh6Ua37UrwmWXQgAEDtD8krRpH79E68uLq1asn+/bt03pDRYsWVRmepLvqFk/AcROE6fCN6TL80bYVK1aoeK6utIffH4Z2cMbFWJJgSbBM+Pbtm6sKQXoXUfuxY8eqDCWdeXFGxz0DxwXfvXsnrVq1kg0bNrgWAQMSwW+8vHhDkL8OHDeFx6R58+Zy/PhxV7Qub968snz5csmTJ48r7VltxFONo1Okf509e1ZlTga7RCEjCQ8Mk4IX45ovY1zoJ9m0aVOlKcEIOSE4Tb2GpoYDrwtEDFBMEr179w5qrMNt5Ffg2zdw5Je0b9/ecUI1EwCLXYIxfohv4FiaBGvDDho0SEsEy8qD8AUciYc4GC9evGilj2EewzIELwhjnBdLEN8mB8wvoKFpjHHBZjMlSJBATTCVKlVS1YReiicaByCqAs+dOyfTp09XC2DKKt0QUvPJf8PbTDmSVzOsNnBGgQixVcorKX4jJ9jtOi4DPsVwjRs3VvYwDky0UecrrAUcpZRoF+lV+MbwyTktr7SrlQDLnz+/en3RwuzZs2spCnYVHFYBJhU1pLh3wiratQvD6fHYrs2aNVPrxSxZsrg6gQQFzhjcGa94HRcvXqzcRy9fvnR6r1rOwzSjspDXuHjx4q4UyAUN7tKlS2qW3LZtm/J+BDtTaiH3X48JGlimTBkZOnSoKk8PZgljG5wB5u7duyr8R2KyX2VHTiEnTZpU2rVrJ+QHMwY6mYltg8MhSZCZcez8+fOuOyWdwrB7Hs5PoJEESU0GkX87YgmcoWUsXkkaJPTm1jrMTmd1HEstBPlzgwcPVrEKXl8rr7AlcMyWmEd9+/aV/fv3e7a00AHKrE20r3Dhwir9Ft8eMMOTcMEBje0uWFySSPM3C5vCLF26VM284Y17AcEB7cSJE6q8CK9tZBBMOKycypUrB9S8gODu378veGoPHjwYGZj9c4/EL0iBzZUrV5j3HSY4Zk+chHhYdUfg/7SnwuRA8jel6WFtiBAmOKLuJED7lRjoN0yWJ2gdFoeZmILDIIf46tWr/e6/r9fHUYALzGzjK1NwDx8+lPLly3u+7YWvlEwuTtb6oUOHJGPGjP/3X1NweDgqVKggTA6RWTDNWLeaBbtNweE/q1ixoms7bkVU+HhVGOvJtQst/4IL8FRtg2P3QLIoyeGNzMIuEqxhzXKJTTXu+fPnyvV85syZyMxNsmXLJgcOHDBNVDQFx4KXDQmIlP+pjkndT5RFMOm348ePN91G0hQcsMgkIv306NGjuvv4R7bPLjlkQhmb+FmaHDgIeEeOHFELYca8yCTp0qWT+fPnq5VFWBLQyCcGSgIgfqodO3b8dX640FDwy5UtW1bZ6KRoBMoOCNcfR+OE+cguIsjBxPE3CnsMA4wNXuLGjRvuLVoCx2vL59GjR7Jp0ya1s+qpU6dUkCaiek4Y/CkmIXjNK1m3bl3JlCmTJe8vVC2B+x0/zk1S7oHIxMGeHsRUsW8jgpAqQWiQ/Ujw9OL1xYg3PL5W4g2OwIWGg8bx+t66dUulPVy+fPmf/cqJs1IcQsU0Kfp8GDeB76Zws4xPjEnUb+FDoyqadAjsTTQpR44cSrtYm7GfXLA7VdvWuNA3bKzz6DzfAcmYyIdIGFuhAY8I2atXr1TQ2tjTnJ/4+/g7UHGeGoD5TnsGDH4acBiPgMKH8YgPfwMWZhJb2fI7AWjqVflwrlVtsvJQ/wOrYBtiZehN6gAAAABJRU5ErkJggg=='
interface BodyCreate {
    name: string;
    email: string;
    password: string;
    avatar: string;
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
    avatar: string;
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
            avatar: DEFAULT_AVATAR,
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
            email: isExist[0].email,
            avatar: isExist[0].avatar
        }
    }
}
const updateValidation = (body: UpdateValidation) => {
    if ((String(body.id).length === 0) || !body.id) {
        return { isError: true, value: 'The $id parameter is missing from the request body' }
    }
    if ((String(body.email).length === 0) || !body.email) {
        return { isError: true, value: 'The $email parameter is missing from the request body' }
    }
    if ((String(body.name).length === 0) || !body.name) {
        return { isError: true, value: 'The $name parameter is missing from the request body' }
    }
    if ((String(body.avatar).length === 0) || !body.avatar) {
        return { isError: true, value: 'The $avatar parameter is missing from the request body' }
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
                avatar: body.avatar,
                password: hash
            }
        }
    } else {
        return {
            isError: false,
            id: body.id,
            newValue: {
                email: body.email,
                name: body.name,
                avatar: body.avatar
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