interface indexBody {
    userID: string;
}

interface createBody {
    title: string;
    description?: string | null;
    userID: boolean;
}

interface updateBody {
    isComplete: boolean;
    id: string;
}
interface deleteBody {
    id: string;
}
const indexValidation = (body: indexBody) => {
    if ((String(body.userID).length === 0) || !body.userID) {
        return { isError: true, value: 'The $userID parameter is missing from the request body' }
    }
    return { isError: false, userID: body.userID }
}

const createValidation = (body: createBody) => {
    if ((String(body.userID).length === 0) || !body.userID) {
        return { isError: true, value: 'The $userID parameter is missing from the request body' }
    }
    if ((String(body.title).length === 0) || !body.title) {
        return { isError: true, value: 'The $title parameter is missing from the request body' }
    }
    // if ((String(body.description).length === 0) || !body.description) {
    //     return { isError: true, value: 'The $description parameter is missing from the request body' }
    // }
    return {
        isError: false,
        list: {
            title: body.title,
            description: null,
            userID: body.userID
        } as createBody
    }
}


const updateValidation = (body: updateBody) => {
    if ((String(body.id).length === 0) || !body.id) {
        return { isError: true, value: 'The $.id parameter is missing from the request body' }
    }
    if ((String(body.isComplete).length === 0) || body.isComplete === undefined || body.isComplete === null) {
        return { isError: true, value: 'The $.isComplete parameter is missing from the request body' }
    }
    return {
        isError: false,
        list: {
            id: body.id,
            isComplete: body.isComplete
        } as updateBody
    }
}


const deleteValidation = (body: deleteBody) => {
    if ((String(body.id).length === 0) || !body.id) {
        return { isError: true, value: 'The $.id parameter is missing from the request body' }
    }
    return {
        isError: false,
        list: {
            id: body.id,
        } as deleteBody
    }
}

export {
    indexValidation,
    createValidation,
    updateValidation,
    deleteValidation
}