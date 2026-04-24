import { v4 as uuidv4 } from 'uuid';

export const generateUuid = (prefix?: string)=>{
    return prefix ? `${prefix}-${uuidv4()}` : uuidv4();
}
