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
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
});

ticketSchema.pre("findOne", function () {
    this.populate("purchaser", 'email');
});

/* ticketSchema.pre("findOne", async function () {
    this.populate("users.email");

    // Send an email to the purchaser
    await this.users.findOne({ _id: this.purchaser }, { email: 1 }).then((user) => {
        const email = `
        Subject: Confirmacion de ticket de compra

        ${user.name},

        Gracias por comprar con nosotros. El codigo de tu ticket es: ${this.code}.

        La compra fue realizada el dia ${this.purchase_datetime}.

        Estamos a su disposicion por cualquier consulta .

        Muchas gracias,
        El que manda los ticket
        `;

        await mail.send({
            to: user.email,
            from: "tickets@example.com",
            subject: "Confirmacion de ticket de compra",
            body: email,
        });
    });
});
 */

export const ticketModel = model("ticket", ticketSchema)