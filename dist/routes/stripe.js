"use strict";
const express = require('express');
const Stripe = require('stripe');
const { z } = require('zod');
const auth = require('../middleware/auth');
const { query } = require('../db');
const router = express.Router();
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY)
        throw new Error('STRIPE_SECRET_KEY não definido');
    return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
}
const CreateCheckoutSchema = z
    .object({
    type: z.enum(['monthly', 'annual']).optional(),
    plan: z.enum(['monthly', 'annual']).optional(),
})
    .refine((v) => v.type || v.plan, { message: 'Informe type ou plan' });
function toSubscriptionStatus(status) {
    if (status === 'active' || status === 'trialing')
        return 'active';
    if (status === 'past_due' || status === 'unpaid')
        return 'past_due';
    return 'inactive';
}
router.post('/stripe/create-checkout-session', auth, async (req, res, next) => {
    try {
        const body = CreateCheckoutSchema.parse(req.body);
        const type = body.type || body.plan;
        const priceId = type === 'monthly' ? process.env.STRIPE_MONTHLY_PRICE_ID : process.env.STRIPE_ANNUAL_PRICE_ID;
        if (!priceId)
            return res.status(500).json({ error: 'Preço do Stripe não configurado no backend' });
        const { rows } = await query('select id, email, name, stripe_customer_id from users where id = $1', [req.user.id]);
        const user = rows[0];
        if (!user)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        const stripe = getStripe();
        let customerId = user.stripe_customer_id;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { user_id: user.id },
            });
            customerId = customer.id;
            await query('update users set stripe_customer_id = $1 where id = $2', [customerId, user.id]);
        }
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: false,
            success_url: `${frontendUrl}/dashboard?checkout=success`,
            cancel_url: `${frontendUrl}/dashboard?checkout=cancel`,
            metadata: {
                user_id: user.id,
                plan_type: type,
            },
        });
        return res.json({ checkoutUrl: session.url });
    }
    catch (err) {
        if (err?.name === 'ZodError') {
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        }
        return next(err);
    }
});
router.post('/stripe/webhook', async (req, res) => {
    const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeSecret) {
        return res.status(500).send('Webhook não configurado');
    }
    let event;
    try {
        const stripe = getStripe();
        const sig = req.headers['stripe-signature'];
        if (!sig || Array.isArray(sig))
            return res.status(400).send('Assinatura Stripe ausente');
        event = stripe.webhooks.constructEvent(req.body, sig, stripeSecret);
    }
    catch (err) {
        return res.status(400).send(`Webhook inválido: ${err.message}`);
    }
    try {
        const stripe = getStripe();
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const customer = session.customer;
            if (customer) {
                await query("update users set subscription_status = 'active' where stripe_customer_id = $1", [customer]);
            }
        }
        if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
            const subscription = event.data.object;
            const customer = subscription.customer;
            const nextStatus = toSubscriptionStatus(subscription.status);
            await query('update users set subscription_status = $1 where stripe_customer_id = $2', [nextStatus, customer]);
        }
        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            await query("update users set subscription_status = 'inactive' where stripe_customer_id = $1", [subscription.customer]);
        }
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const customer = invoice.customer;
            if (customer) {
                await query("update users set subscription_status = 'active' where stripe_customer_id = $1", [customer]);
            }
        }
        if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object;
            const customer = invoice.customer;
            if (customer) {
                await query("update users set subscription_status = 'past_due' where stripe_customer_id = $1", [customer]);
            }
        }
        // responder sempre 200
        return res.json({ received: true });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('Erro no webhook Stripe', err);
        return res.status(500).json({ error: 'Erro ao processar webhook' });
    }
});
router.post('/stripe/create-portal-session', auth, async (req, res, next) => {
    try {
        const { rows } = await query('select id, email, name, stripe_customer_id from users where id = $1', [req.user.id]);
        const user = rows[0];
        if (!user)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        const stripe = getStripe();
        let customerId = user.stripe_customer_id;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { user_id: user.id },
            });
            customerId = customer.id;
            await query('update users set stripe_customer_id = $1 where id = $2', [customerId, user.id]);
        }
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const portal = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${frontendUrl}/conta`,
        });
        return res.json({ url: portal.url });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = router;
