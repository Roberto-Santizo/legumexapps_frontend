import axios from 'axios'
import { UsersAPIResponseSchema } from '../utils/users-schema';

export async function getUsers() {
    const url = 'http://127.0.0.1:8000/api/users';
    const { data } = await axios(url)
    const result = UsersAPIResponseSchema.safeParse(data)
    console.log(result);
    if(result.success) {
        return result.data
    }
}