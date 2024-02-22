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
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'menu',
            required: true,
        },
        orderName: {
            type: String,
            required: true,
        },
    }],
}, { timestamps: true });


const Order = mongoose.model('Order', ordersSchema);
module.exports = Order
