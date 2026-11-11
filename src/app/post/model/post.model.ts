import {HydratedDocument, model, Schema, Types} from 'mongoose';

export interface IPost {
    content: string;
    userId: Types.ObjectId;
    commentsCount: number;
    reactionsCount: number;
    allowsComments: boolean;
    isDeleted?: boolean;
}

export type PostDocument = HydratedDocument<IPost>;

const schema = new Schema<IPost>({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 2000
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    reactionsCount: {
        type: Number,
        default: 0
    },
    allowsComments: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export const Post = model<IPost>('Post', schema);
