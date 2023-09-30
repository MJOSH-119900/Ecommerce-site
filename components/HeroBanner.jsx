import React from 'react';
import Link from 'next/link';

import { urlFor } from '@/LIB/client';

const HeroBanner = ({ heroBanner }) => {
	return (
		<div className="hero-banner-container">
			<div>
				<p className="t-shirtOne z-[99]">{heroBanner.smallText}</p>
				<h3 className="z-[99]">{heroBanner.midText}</h3>
				<h1 className="z-[99]">{heroBanner.largeText1}</h1>
				<img
					src={urlFor(heroBanner.image)}
					alt="t-shirt"
					className="hero-banner-image opacity-70 "
				/>

				<div className="my-4 items-center text-1xl text-[#324d67] ">
					<h4 className="z-[99] m-2">
						<p>{heroBanner.discount}</p>
						{heroBanner.saleTime}
					</h4>
				</div>

				<div>
					<Link href={`/product/smart-watch`}>
						<button type="button">{heroBanner.buttonText}</button>
					</Link>
					<div className="desc">
						<h5>description</h5>
						<p>{heroBanner.desc}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
export default HeroBanner;
