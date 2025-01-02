import axios from 'axios'
import { UsersAPIResponseSchema } from '../utils/users-schema';

export async function getUsers() {
    const url = '';
    const { data } = await axios(url)
    const result = UsersAPIResponseSchema.safeParse(data)
    if(result.success) {
        return result.data
    }
}