import { Document } from "mongoose";

export interface UserDocument extends Document {
    id: string,
    moniker: string,
    joined: Date
}