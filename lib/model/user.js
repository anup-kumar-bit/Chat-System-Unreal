import { Schema, models, model } from 'mongoose';

const userSchema = new Schema({
    user: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student', 'institute'], required: true },
    password: { type: String, required: true },
});

const User = models.User || model('User', userSchema);

export default User;
