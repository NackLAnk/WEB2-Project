const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    email_validated: { type: Boolean},
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatar: { type: String, }
}, { collection: 'admins' });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
