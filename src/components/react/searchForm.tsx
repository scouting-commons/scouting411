import { ArrowRightIcon, SearchIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/util/cn";
import { Icon } from "@/components/react/icon";

/** a plain get form to the search page, so it works without javascript */
export function SearchForm({
	query,
	tab,
	autoFocus,
	className,
}: {
	/** the current query, to fill in the box */
	query?: string;
	/** the search page's current tab, to stay on it for the next search */
	tab?: string;
	/** focus the box on load, for pages where searching is the main thing to do */
	autoFocus?: boolean;
	className?: string;
}) {
	return (
		<form
			action="/search"
			method="get"
			role="search"
			className={cn("w-full", className)}
		>
			{tab && <input type="hidden" name="tab" value={tab} />}
			<InputGroup className="h-11 rounded-full px-1.5">
				<InputGroupAddon>
					<Icon icon={SearchIcon} />
				</InputGroupAddon>
				<InputGroupInput
					name="q"
					autoFocus={autoFocus}
					type="search"
					defaultValue={query}
					placeholder="Search..."
					aria-label="Search"
					required
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="submit"
						size="icon-sm"
						className="rounded-full"
						aria-label="Search"
					>
						<Icon icon={ArrowRightIcon} />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}
