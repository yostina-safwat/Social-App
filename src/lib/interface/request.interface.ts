import {TUserPayload} from "./userPayload.interface";

// reopen express types
declare module 'express-serve-static-core' {
    interface Request {
        user?: TUserPayload;
    }
}
