import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    {shipping_rate: 'shr_1KvaDQF4rkZDI5JnMPZuXCuA'},
                    {shipping_rate: 'shr_1KvaENF4rkZDI5JnKBJQ2OCt'},
                    {shipping_rate: 'shr_1KvaF5F4rkZDI5JndV2dL9yn'},
                ],
                line_items: req.body.map(product => {
                    const img = product.image[0].asset._ref;
                    const newImage = img.replace('image-', 'https://cdn.sanity.io/images/w4ls24pq/production/').replace('-webp', '.webp')

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: product.name,
                                images: [newImage],
                            },
                            unit_amount : product.price * 100,
                        },
                        adjustable_quantity : {
                            enabled : true,
                            minimum : 1,
                        },
                        quantity : product.quantity,
                    }
                }),
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
            }
            const session = await stripe.checkout.sessions.create(params);
            res.status(200).json(session)
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}