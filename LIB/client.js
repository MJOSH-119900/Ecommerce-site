import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
	projectId: '9954t0b5',
	dataset: 'production',
	apiVersion: '2023-03-01',
	useCdn: true,
	token: process.env.SANITY_SERVER_TOKEN, // Use a server-side token
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
