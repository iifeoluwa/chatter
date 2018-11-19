import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: { 
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
})

export default mongoose.model('User', UserSchema);