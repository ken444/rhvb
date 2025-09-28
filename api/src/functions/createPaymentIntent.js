import { app } from '@azure/functions';

// Make sure to add your Stripe secret key to your environment variables
// (e.g., in local.settings.json for local development)
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const VOLLEYBALL_EVENT_COST = 500; // Cost in cents ($5.00)

app.http('createPaymentIntent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`HTTP function processed request for url "${request.url}"`);
        const { playerName, email } = await request.json();

        if (!playerName || !email) {
            return { status: 400, body: "Missing required fields: playerName and email." };
        }

        try {
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: VOLLEYBALL_EVENT_COST,
                currency: 'cad',
                receipt_email: email,
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    playerName: playerName,
                }
            });

            // Return the client secret to the front-end
            return { jsonBody: { clientSecret: paymentIntent.client_secret } };
        } catch (error) {
            context.log.error('Error creating payment intent:', error);
            return { status: 500, body: `Internal Server Error: ${error.message}` };
        }
    }
});