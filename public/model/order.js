const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    customer: [{
        customer_Id: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        customer_Name: {
            type: String,
            required: true,
        },
    }],
    customer_comment: {
        type: String,
    },
    orderDetails: [{
        orderName: {
            type: String,
            required: true,
        },
    }],
    order_price: {
        type: String,
        required: true,
    }
}, { timestamps: true });


const Order = mongoose.model('Order', ordersSchema);
module.exports = Order
