const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: {
        type: Number,
        unique: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerComment: {
        type: String,
    },
    orderDetails: {
        type: [Schema.Types.Mixed],
        required: true,
    },
    orderPrice: {
        type: String,
        required: true,
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
