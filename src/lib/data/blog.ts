import type { BlogPost } from '$lib/types';

export const blogPosts: BlogPost[] = [
	{
		slug: 'managing-state-in-elm-single-page-applications',
		title: 'Managing State in Elm Single Page Applications',
		date: 'March 2025'
	},
	{
		slug: 'motivation-behind-true-acumen',
		title: 'Motivation for True Acumen',
		date: 'January 2025'
	}
];

export function findPost(slug: string): BlogPost | undefined {
	return blogPosts.find((post) => post.slug === slug);
}
