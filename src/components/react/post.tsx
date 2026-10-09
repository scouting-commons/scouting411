import type { Post } from "@/lib/news/post";

export function PostComponent({ post }: { post: Post }) {
	return (
		<div className="@container rounded-lg border">
			<div className="flex flex-col gap-3 p-4 @xl:flex-row @xl:justify-between @xl:gap-4 @xl:p-6">
				<img
					className="h-44 w-full rounded-lg border object-cover @xl:order-1 @xl:h-36 @xl:w-48 @xl:shrink-0"
					src={post.thumbnail ?? post.feed.coverImageSrc}
				/>

				<div className="flex min-w-0 flex-col items-start gap-2 @xl:gap-3">
					<span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
						<a href={post.feed.links.overview} className="hover:underline">
							{post.feed.name}
						</a>

						<span className="font-bold">&middot;</span>
						<span className="whitespace-nowrap">
							{post.date.toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
					</span>
					<a
						href={post.url}
						rel="noopener noreferrer"
						target="_blank"
						className="text-primary font-serif text-lg font-bold wrap-anywhere hyphens-auto hover:underline @xl:text-xl"
					>
						{post.title}
					</a>
					<span className="line-clamp-3 text-sm wrap-anywhere hyphens-auto">
						{post.description || "No excerpt available."}
					</span>
				</div>
			</div>
		</div>
	);
}
