import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { 
        type: String, 
        required: true 
    },
    last_name: { 
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    age: { 
        type: Number, 
        required: true,
        min: 0
    },
    password: { 
        type: String, 
        required: true
    },
    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Carts',
        required: false  // Ahora no es obligatorio al principio
    },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
