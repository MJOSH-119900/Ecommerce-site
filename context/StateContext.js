import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

const getLocalCartStoredItems = () => {
	if (typeof window !== 'undefined') {
		// Check if we are on the client side before accessing localStorage
		const localStorageCartItems = localStorage.getItem('cartItems');
		const localStorageTotalPrice = localStorage.getItem('totalPrice');
		const localStorageTotalQuantities = localStorage.getItem('totalQuantities');

		if (localStorageCartItems === null) {
			return {
				cartItems: [],
				totalPrice: 0,
				totalQuantities: 0,
			};
		} else {
			return {
				cartItems: JSON.parse(localStorageCartItems),
				totalPrice: parseFloat(localStorageTotalPrice),
				totalQuantities: parseInt(localStorageTotalQuantities),
			};
		}
	}

	return {
		cartItems: [],
		totalPrice: 0,
		totalQuantities: 0,
	};
};

const initializeState = getLocalCartStoredItems();

export const StateContext = ({ children }) => {
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState(initializeState.cartItems);
	const [totalPrice, setTotalPrice] = useState(initializeState.totalPrice);
	const [totalQuantities, setTotalQuantities] = useState(
		initializeState.totalQuantities
	);
	const [qty, setQty] = useState(1);

	let foundProduct;

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Check if we are on the client side before using localStorage
			localStorage.setItem('cartItems', JSON.stringify(cartItems));
			localStorage.setItem('totalPrice', totalPrice.toString());
			localStorage.setItem('totalQuantities', totalQuantities.toString());
		}
	}, [cartItems, totalPrice, totalQuantities]);

	const onAdd = (product, quantity) => {
		const checkProductInCart = cartItems.find(
			(item) => item._id === product._id
		);

		setTotalPrice(
			(prevTotalPrice) => prevTotalPrice + product.price * quantity
		);
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

		if (checkProductInCart) {
			const updatedCartItems = cartItems.map((cartProduct) => {
				if (cartProduct._id === product._id)
					return {
						...cartProduct,
						quantity: cartProduct.quantity + quantity,
					};
			});

			setCartItems(updatedCartItems);
		} else {
			product.quantity = quantity;

			setCartItems([...cartItems, { ...product }]);
		}

		toast.success(`${qty} ${product.name} added to the cart.`);
	};

	const onRemove = (product) => {
		foundProduct = cartItems.find((item) => item._id === product._id);
		const newCartItems = cartItems.filter((item) => item._id !== product._id);

		setTotalPrice(
			(prevTotalPrice) =>
				prevTotalPrice - foundProduct.price * foundProduct.quantity
		);
		setTotalQuantities(
			(prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
		);
		setCartItems(newCartItems);
	};

	const toggleCartItemQuantity = (id, value) => {
		// Your existing logic to update cart items here
		const updatedCartItems = cartItems.map((item) => {
			if (item._id === id) {
				if (value === 'inc') {
					return { ...item, quantity: item.quantity + 1 };
				} else if (value === 'dec' && item.quantity > 1) {
					return { ...item, quantity: item.quantity - 1 };
				}
			}
			return item;
		});

		setCartItems(updatedCartItems);

		// Your existing code to update total price and total quantities
		const foundProduct = cartItems.find((item) => item._id === id);

		if (foundProduct) {
			if (value === 'inc') {
				setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
				setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
			} else if (value === 'dec' && foundProduct.quantity > 1) {
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
				setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
			}
		}
	};

	const increaseQty = () => {
		setQty((prevQty) => prevQty + 1);
	};
	const decreaseQty = () => {
		setQty((prevQty) => {
			if (prevQty - 1 < 1) return 1;
			return prevQty - 1;
		});
	};

	return (
		<Context.Provider
			value={{
				setShowCart,
				showCart,
				cartItems,
				totalPrice,
				totalQuantities,
				qty,
				increaseQty,
				decreaseQty,
				onAdd,
				toggleCartItemQuantity,
				getLocalCartStoredItems,
				onRemove,
				setCartItems,
				setTotalPrice,
				setTotalQuantities,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useStateContext = () => useContext(Context);
