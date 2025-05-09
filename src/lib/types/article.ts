export interface SeoData {
	id: number;
	metaTitle: string;
	metaDescription: string;
}

interface ImageFormat {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	size: number;
	width: number;
	height: number;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
}

export interface Tag {
	id: number;
	zymas?: string;
	zymo?: string;
	zyma?: string;
	slug: string;
}

export interface ArticleImage {
	id: number;
	documentId: string;
	name: string;
	alternativeText: string | null;
	caption: string | null;
	width: number;
	height: number;
	formats: {
		large?: ImageFormat;
		small?: ImageFormat;
		medium?: ImageFormat;
		thumbnail?: ImageFormat;
	};
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: string | null;
	provider: string;
	provider_metadata: Record<string, unknown> | null;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface Article {
	id: number;
	documentId: string;
	Title: string;
	Data: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	IlgasPavadinimas: string;
	Tekstas: string;
	TekstasHtml?: string | Promise<string>;
	Image?: string | null;
	Nuotrauka?: ArticleImage;
	Seo?: Array<{
		id: number;
		metaTitle: string;
		metaDescription: string;
	}>;
	categories: Array<{
		id: number;
		documentId: string;
		name: string;
		slug: string;
		description: string;
	}>;
	tags: Array<{
		id: number;
		documentId: string;
		zyma?: string;
		zymas?: string;
		zymo?: string;
		slug: string;
	}>;
}
