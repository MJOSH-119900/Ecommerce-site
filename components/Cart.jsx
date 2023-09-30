import React, { useRef } from 'react';
import { useStateContext } from '@/context/StateContext';
import {
	AiFillDelete,
	AiOutlineLeft,
	AiOutlineMinus,
	AiOutlinePlus,
	AiOutlineShopping,
} from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import Link from 'next/link';
import { urlFor } from '@/LIB/client';
import getStripe from '@/LIB/getStripe';
import toast from 'react-hot-toast';

const Cart = () => {
	const cartRef = useRef();
	const {
		totalPrice,
		totalQuantities,
		cartItems,
		setShowCart,
		toggleCartItemQuantity,
		onRemove,
	} = useStateContext();

	const handleCheckout = async () => {
		const stripe = await getStripe();

		const response = await fetch('/api/stripe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(cartItems),
		});

		if (response.statusCode === 500) return;

		const data = await response.json();

		toast.loading('Redirecting...');

		stripe.redirectToCheckout({ sessionId: data.id });
	};

	return (
		<div className="cart-wrapper" ref={cartRef}>
			<div className="cart-container fixed">
				<button
					type="button"
					className="cart-heading "
					onClick={() => setShowCart(false)}
				>
					<AiOutlineLeft />
					<span className="heading">Your Cart</span>
					<span className="cart-num-items">({totalQuantities} items)</span>
				</button>

				{cartItems.length < 1 && (
					<div className="empty-cart ">
						<div className="w-40 h-40 mx-auto items-center justify-center">
							<AiOutlineShopping size={150} />
						</div>
						<h3>Your Shopping bag is empty</h3>
						<Link href="">
							<button
								type="button"
								onClick={() => setShowCart(false)}
								className="btn wrap "
							>
								Continue Shopping
							</button>
						</Link>
					</div>
				)}
				<div className="product-container item ">
					{cartItems.length >= 1 &&
						cartItems.map((item) => (
							<div className="product" key={item._id}>
								<img
									src={urlFor(item?.image[0])}
									className="cart-product-image"
								/>
								<div className="item-desc">
									<div className="flex top">
										<h5>{item.name}</h5>
										<h4>${item.price}</h4>
									</div>
									<div className="flex bottom">
										<div>
											<p className="quantity-desc bg-gray-300 shadow-slate-400 shadow">
												<span
													className="minus"
													onClick={() =>
														toggleCartItemQuantity(item._id, 'dec')
													}
												>
													<AiOutlineMinus />
												</span>
												<span className="num">{item.quantity}</span>
												<span
													className="plus"
													onClick={() =>
														toggleCartItemQuantity(item._id, 'inc')
													}
												>
													<AiOutlinePlus />
												</span>
											</p>
										</div>
										<button
											type="button"
											className="remove-item"
											onClick={() => onRemove(item)}
										>
											<AiFillDelete />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
				{cartItems.length >= 1 && (
					<div className="cart-bottom">
						<div className="total">
							<h3>Subtotal:</h3>
							<h3>${totalPrice}</h3>
						</div>
						<div className="btn-container">
							<button
								className="btn"
								type="btn-container"
								onClick={handleCheckout}
								target="_blank"
							>
								Pay With Stripe
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default Cart;
