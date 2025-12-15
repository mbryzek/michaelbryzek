export interface Project {
	name: string;
	description: string[];
	githubUrl?: string;
	projectUrl?: string;
	blogUrl?: string;
}

export interface Talk {
	title: string;
	event: string;
	date: string;
	description: string;
	videoUrl: string;
}

export interface Link {
	name: string;
	description: string[];
	url: string;
}

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
}
