const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    menu__id: {
        type: String,
        require: true,
    },
    ingredients: {
        type: String,
        require: true,
    },
    price: {
        type: 'string',
        require: true,
    },
    countSales: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    }
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu