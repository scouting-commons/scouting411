import { CardFeed } from "@/components/react/cardFeed";
import { queryResources } from "@/lib/resources/query";
import { Resource } from "@/components/react/resource";

export function Page() {
	const resources = queryResources();

	return (
		<div className="flex flex-1 flex-col gap-5 p-8">
			<CardFeed>
				{resources.map((resource) => (
					<Resource resource={resource} key={resource.url} />
				))}
			</CardFeed>
		</div>
	);
}
