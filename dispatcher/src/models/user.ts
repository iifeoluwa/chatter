import { Schema, Model, model } from "mongoose";
import { UserDocument } from "../interfaces/user";

export interface IUser extends UserDocument {

}

export interface UserModel extends Model<IUser> {
    fetchById(id: string): Promise<IUser|null>;
}

const UserSchema: Schema = new Schema({
    userId: { 
        type: String, 
        index: true, 
        required: true,
        unique: true
    },
    moniker: { 
        type: String, 
        index: true, 
        required: true,
        unique: true
    },
    joined: { 
        type: Date, 
        default: Date.now 
    },
});

UserSchema.statics.fetchById = function(id: string) {
    return this.findOne({userId: id});
}

export const User: UserModel = model<IUser, UserModel>('User', UserSchema);