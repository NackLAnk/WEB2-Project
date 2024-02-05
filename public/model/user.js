const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    // avatar: { type: String, default: "null" }
}, { collection: 'Users' });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
