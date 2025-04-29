export type FetcherResponse = {
	success: boolean;
	message: string;
	redirectTo?: string;
};
export type VideoPlayerTypes = {
	type: "Vimeo" | "Youtube" | "Bunny";
	url: string;
};
