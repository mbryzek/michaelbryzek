import type { Talk } from '$lib/types';

export const talks: Talk[] = [
	{
		title: 'Testing in Production',
		event: 'Software Unscripted Podcast',
		date: 'January 2025',
		description:
			"A conversation with Richard Feldman about embracing 'testing in production' as a way to improve overall quality of software. We dive into aligning organizational incentives, embracing true continuous delivery and some rarer practices including the elimination of testing and staging environments.",
		videoUrl: 'https://www.youtube.com/watch?v=j6ow-UemzBc'
	},
	{
		title: 'Design Microservice Architectures the Right Way',
		event: 'QCon NYC 2018',
		date: 'September 2018',
		description:
			'A deep dive into how we designed and built the microservice architecture at Flow Commerce, based on the lessons we learned at Gilt Groupe. This talk has over 700k views as of early 2025.',
		videoUrl: 'https://www.youtube.com/watch?v=j6ow-UemzBc'
	},
	{
		title: 'Building a Startup in NYC',
		event: 'Startup Grind',
		date: 'December 2013',
		description:
			"This was a really fun talk for me with my family visiting in NYC. We talked about what it was like to build gilt.com - but also about my family's background escaping Poland and building a new life in America - events that have deeply shaped my own personality, work ethic, and values.",
		videoUrl: 'https://www.youtube.com/watch?v=XWM_H3Acq8w&t=5s'
	}
];
