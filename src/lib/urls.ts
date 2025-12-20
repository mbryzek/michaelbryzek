export const urls = {
	index: '/',
	blog: '/blog',
	blogPost: (slug: string) => `/blog/${slug}`,
	projects: '/projects',
	talks: '/talks',
	links: '/links',
	companies: {
		gilt: '/companies/gilt',
		flow: '/companies/flow'
	}
};
