import { app } from '@azure/functions';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.http('updatePaymentIntent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const { clientSecret, playerName, email } = await request.json();

        if (!clientSecret) {
            return { status: 400, body: "Missing clientSecret." };
        }

        try {
            const paymentIntentId = clientSecret.split('_secret_')[0];
            
            const updatePayload = { metadata: { playerName: playerName } };
            if (email) {
                updatePayload.receipt_email = email;
            }

            await stripe.paymentIntents.update(paymentIntentId, updatePayload);
            return { status: 200, body: "Payment Intent Updated" };
        } catch (error) {
            return { status: 500, body: `Error: ${error.message}` };
        }
    }
});