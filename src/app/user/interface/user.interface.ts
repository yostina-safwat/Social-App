import {Types} from "mongoose";
import {Gender, Provider} from "../../auth/enum";

export interface IUser {
    _id: Types.ObjectId;
    userName: string;
    email: string;
    password: string;
    provider: Provider;
    gender: Gender;
    phoneNumber?: string;
    isVerified?: boolean;
    isDeleted?: boolean;
}
