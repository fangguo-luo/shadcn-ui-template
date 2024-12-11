import {get} from "./request.ts";

export const getUserInfo = () => get<any>('/user/getUserInfo', {});