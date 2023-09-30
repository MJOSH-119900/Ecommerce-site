// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// export default async function handler(req, res) {
// 	if (req.method === 'POST') {
// 		console.log(req.body);
// 		try {
// 			const params = {
// 				// additional properties
// 				submit_type: 'pay',
// 				mode: 'payment',
// 				payment_method_types: ['card'],
// 				billing_address_collection: 'auto',
// 				shipping_options: [
// 					{ shipping_rate: 'shr_1NpF7WKCXnqhX1F2nLzaoLOJ' },
// 					{ shipping_rate: 'shr_1NpFBBKCXnqhX1F2o1wW3msn' },
// 				],
// 				line_items: req.body.map((item) => {
// 					const img = item.image[0].asset._ref;
// 					const newImage = img
// 						.replace(
// 							'image-',
// 							'https://cdn.sanity.io/images/9954t0b5/production/'
// 						)
// 						.replace('-webp', '.webp', '-jpg', '.jpg');
// 					console.log('IMAGE', newImage);

// 					return {
// 						price_data: {
// 							currency: 'usd',
// 							product_data: {
// 								name: [newImage],
// 							},
// 							unit_amount: item.price * 100,
// 						},
// 						adjustable_quantity: {
// 							enabled: true,
// 							minimun: 1,
// 						},
// 						quantity: item.quantity,
// 					};
// 				}),
// 				success_url: `${req.headers.origin}/?success=true`,
// 				cancel_url: `${req.headers.origin}/?canceled=true`,
// 			};
// 			// Create Checkout Sessions from body params.
// 			const session = await stripe.checkout.sessions.create(params);

// 			res.status(200).json(session);
// 		} catch (err) {
// 			res.status(err.statusCode || 500).json(err.message);
// 		}
// 	} else {
// 		res.setHeader('Allow', 'POST');
// 		res.status(405).end('Method Not Allowed');
// 	}
// }

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	if (req.method === 'POST') {
		console.log(req.body);
		try {
			const params = {
				submit_type: 'pay',
				mode: 'payment',
				payment_method_types: ['card'],
				billing_address_collection: 'auto',
				shipping_options: [
					{ shipping_rate: 'shr_1NpF7WKCXnqhX1F2nLzaoLOJ' },
					{ shipping_rate: 'shr_1NpFBBKCXnqhX1F2o1wW3msn' },
				],
				line_items: req.body.map((item) => {
					const img = item.image[0].asset._ref;
					// Replace image- with the CDN URL and handle different image formats
					const newImage = img
						.replace(
							'image-',
							'https://cdn.sanity.io/images/9954t0b5/production/'
						)
						.replace('-webp', '.webp') // Handle .webp extension
						.replace('-jpg', '.jpg') // Handle .jpg extension
						.replace('-png', '.png'); // Handle .png extension

					console.log('IMAGE', newImage);

					return {
						price_data: {
							currency: 'usd',
							product_data: {
								name: item.name,
								images: [newImage],
							},
							unit_amount: item.price * 100,
						},
						adjustable_quantity: {
							enabled: true,
							minimum: 1,
						},
						quantity: item.quantity,
					};
				}),
				success_url: `${req.headers.origin}/success`,
				cancel_url: `${req.headers.origin}/canceled`,
			};

			// Create Checkout Sessions from body params.
			const session = await stripe.checkout.sessions.create(params);

			res.status(200).json(session);
		} catch (err) {
			res.status(err.statusCode || 500).json(err.message);
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
