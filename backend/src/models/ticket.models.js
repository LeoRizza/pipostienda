import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid"

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        default: uuidv4()
    },
    purchase_datetime: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        ref: "users",
        required: true
    }
});

ticketSchema.pre("findOne", function () {
    this.populate("purchaser", 'first_name last_name email');
});

export const ticketModel = model("ticket", ticketSchema)