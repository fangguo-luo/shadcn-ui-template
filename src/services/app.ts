import {post} from "./request.ts";

export const getUserToken = (param:any) => post<any>('/auth/auth-token', param,{
    'Content-Type': 'application/json'
});