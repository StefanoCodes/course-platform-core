import { extractVimeoVideoId, extractYoutubeVideoId } from "~/lib/utils";

interface VideoPlayerProps {
	type: "Vimeo" | "Youtube";
	url: string;
}

export function VideoPlayer({ type, url }: VideoPlayerProps) {
	return (
		<div className="video-container">
			{type === "Youtube" && <YoutubePlayer url={url} />}
			{type === "Vimeo" && <VimeoPlayer url={url} />}
		</div>
	);
}

function YoutubePlayer({
	url,
}: {
	url: VideoPlayerProps["url"];
}) {
	return (
		<iframe
			src={`https://www.youtube.com/embed/${extractYoutubeVideoId(url)}`}
			frameBorder="0"
			allowFullScreen
		></iframe>
	);
}

function VimeoPlayer({
	url,
}: {
	url: VideoPlayerProps["url"];
}) {
	return (
		<iframe
			src={`https://player.vimeo.com/${extractVimeoVideoId(url)}`}
			frameBorder="0"
			allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
			title="My Video"
		/>
	);
}
