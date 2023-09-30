import { useState, useEffect } from 'react';

const setCartItemsInLocalStorage = (items) => {
	localStorage.setItem('cartItems', JSON.stringify(items));
};

const getCartItemsFromLocalStorage = () => {
	const storedCartItems = localStorage.getItem('cartItems');
	return storedCartItems ? JSON.parse(storedCartItems) : [];
};

const App = () => {
	// Initialize cart items from local storage
	const [cartItems, setCartItems] = useState(getCartItemsFromLocalStorage);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantities, setTotalQuantities] = useState(0);

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

		// Update the local storage after modifying the cart items
		setCartItemsInLocalStorage(updatedCartItems);

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

	// Render your cart items and handle quantity changes
	// ...

	return <div>{/* Render your cart and its items here */}</div>;
};

export default App;
