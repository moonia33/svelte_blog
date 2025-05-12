import { PUBLIC_URL } from '$env/static/public';

export const GET = () => {
	const content = `
User-agent: *
Allow: /

Sitemap: ${PUBLIC_URL.replace(/\/+$/, '')}/sitemap.xml
`;

	return new Response(content.trim(), {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};
