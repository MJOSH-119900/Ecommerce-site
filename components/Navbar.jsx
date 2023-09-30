import React from 'react';
import Link from 'next/link';

import { AiOutlineShopping } from 'react-icons/ai';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import Cart from './Cart';
import { useStateContext } from '@/context/StateContext';

const Navbar = () => {
	const { showCart, setShowCart, totalQuantities } = useStateContext();

	return (
		<div className="navbar-container items-center">
			<p className="logo">
				<Link href="/" className="uppercase">
					Ultimate Shop
				</Link>
			</p>

			<div className="flex items-center justify-center">
				<div className="flex bg-gray-300 text-gray-400 object-contain my-2 rounded-md outline-0 min-w-[350px] lg:min-w-[1000px] md:min-w-[600px]">
					<HiMagnifyingGlass className="p-2 text-[40px]" />
					<input
						type="text"
						placeholder="Search..."
						className="rounded-md bg-[#eef3f8] border-[1px] opacity-70 border-gray-400 lg:min-w-[95%] md:min-w-[95%] min-w-[95%]"
					/>
				</div>
			</div>

			<div>
				<button
					onClick={() => setShowCart(true)}
					type="button"
					className="cart-icon"
				>
					<AiOutlineShopping />
					<span
						className="cart-item-qty top-[-5px]"
						suppressHydrationWarning={true}
					>
						{totalQuantities}
					</span>
				</button>
			</div>

			{showCart && <Cart />}
		</div>
	);
};
export default Navbar;
