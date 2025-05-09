// src/lib/utils/escapeJsonLd.ts
export function escapeJsonLd(json: string) {
	return json.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
}
