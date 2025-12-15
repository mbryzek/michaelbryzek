import type { Project } from '$lib/types';
import { urls } from '$lib/urls';

export const projects: Project[] = [
	{
		name: 'Private Dinkers',
		description: [
			'AI-powered pickleball game scheduling application making it easy to schedule great games with your favorite players.'
		],
		githubUrl: undefined,
		projectUrl: 'https://privatedinkers.com',
		blogUrl: undefined
	},
	{
		name: 'True Acumen',
		description: [
			'Simple, accurate expense and budget management.',
			'I recently have become really obsessed with making it easy to track family expenses and to make a simple budget.'
		],
		githubUrl: undefined,
		projectUrl: 'https://www.trueacumen.com',
		blogUrl: urls.blogPost('motivation-behind-true-acumen')
	},
	{
		name: 'API Builder',
		description: [
			'Simple, Comprehensive Tooling for Modern APIs.',
			'A project we started at Gilt when we needed to build client SDKs to access our APIs from multiple languages, including Ruby, Java, Scala, Swift, Objective C, Kotlin, etc.',
			'We also built Flow Commerce on the back of API Builder - helping us build a high quality, broad API Platform.'
		],
		githubUrl: 'https://github.com/apicollective/apibuilder',
		projectUrl: 'https://www.apibuilder.io',
		blogUrl: undefined
	},
	{
		name: 'Schema Evolution Manager',
		description: [
			'Easily manage schema evolutions as independent artifacts for Postgresql Databases.',
			'This project is mature, well tested and used in production for over a decade. ',
			'The main idea is to separate schema evolutions from application changes making it easier to ensure application changes can be successfully rolled back.'
		],
		githubUrl: 'https://github.com/mbryzek/schema-evolution-manager',
		projectUrl: undefined,
		blogUrl: undefined
	},
	{
		name: 'Bergen Tech Hackathon',
		description: [
			'We run an annual Hackathon at our local high school encouraging and introducing students to the passion we share for computer science. ',
			'This competition website is built in Elm and open source as an example for the students.'
		],
		githubUrl: 'https://github.com/mbryzek/hackathon',
		projectUrl: 'https://www.bthackathon.com',
		blogUrl: undefined
	},
	{
		name: 'Home Owners Association Management Platform',
		description: [
			"I'm currently the president of our homeowner's assocation in the Poconos, PA. ",
			'I built this project to help manage our community with a focus on contact information, bills and key resources.'
		],
		githubUrl: undefined,
		projectUrl: 'https://www.hemlockpoint.net',
		blogUrl: undefined
	},
	{
		name: 'Personal Website',
		description: ['This is the source code for this website, built with SvelteKit.'],
		githubUrl: 'https://github.com/mbryzek/michaelbryzek',
		projectUrl: undefined,
		blogUrl: undefined
	}
];
