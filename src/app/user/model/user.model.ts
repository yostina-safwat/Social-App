import {HydratedDocument, model, Schema} from 'mongoose';
import {Gender, Provider} from "../../auth/enum";
import {IUser} from "../interface/user.interface";

export type UserDocument = HydratedDocument<IUser>;

const schema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: function (this: IUser): boolean {
            return this.provider === Provider.LOCAL;
        },
        trim: true,
    },
    provider: {
        type: Number,
        default: Provider.LOCAL,
        enum: Provider
    },
    gender: {
        type: Number,
        enum: Gender
    },
    phoneNumber: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export const User = model<IUser>('User', schema);
