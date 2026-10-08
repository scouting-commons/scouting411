import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { FilterSidebarItem } from "@/components/react/filterSidebarItem";
import { feeds } from "@/lib/news/feeds/feed";
import { type QueryInput, queryInputSchema } from "@/lib/news/query/types";
import { type ResolvedQuery, resolveQuery } from "@/lib/news/query/resolve";
import { postsQueryParamsEncoder } from "@/lib/news/query/queryParams";
import { useForm } from "@tanstack/react-form";
import type { PaginatedResults } from "@/util/paginateArray";
import type { Post } from "@/lib/news/feeds/post";
import {
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { PaginationControl } from "@/components/react/paginate";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { Icon } from "@/components/react/icon";

/** value -> pretty label for the sort direction select */
const sortDirectionItems = [
	{ value: "desc", label: "Newest first" },
	{ value: "asc", label: "Oldest first" },
] satisfies { value: ResolvedQuery["sort"]["direction"]; label: string }[];

const pageSizeItems = [10, 20, 50, 100].map((size) => ({
	value: size,
	label: `${size} per page`,
}));

/**
 * the form holds the sparse query, so the url records only what the user
 * touched. a field the user hasn't touched is undefined, and displays what it
 * resolves to instead
 */
export function FilterSidebar({
	query,
	setQuery,
	results,
}: {
	query: QueryInput;
	setQuery: React.Dispatch<React.SetStateAction<QueryInput>>;
	results: PaginatedResults<Post> | undefined;
}) {
	const { sort, paginate } = resolveQuery(query);

	// a url can't express `paginate: false`, so browse always pages
	if (paginate === false) {
		throw new Error("the browse page cannot show unpaginated results");
	}

	const form = useForm({
		defaultValues: query,
		listeners: {
			/** push the form values up to the page query whenever they are valid */
			onChange: ({ formApi, fieldApi }) => {
				// any change but the page itself can shrink the results, so go back to page 1
				if (fieldApi.name !== "paginate.page") {
					formApi.setFieldValue("paginate.page", undefined, {
						dontRunListeners: true,
					});
				}

				const parsed = queryInputSchema.safeParse(formApi.state.values);

				if (parsed.success) {
					setQuery(parsed.data);
				}
			},
			onChangeDebounceMs: 300,
		},
	});

	const isFiltered = postsQueryParamsEncoder.encode(query).toString() !== "";

	return (
		<>
			<SidebarHeader className="border-sidebar-border gap-0 border-b p-4">
				<form.Field name="filter.keyword">
					{(field) => (
						<InputGroup>
							<InputGroupAddon>
								<Icon icon={SearchIcon} />
							</InputGroupAddon>
							<InputGroupInput
								type="search"
								placeholder="Search posts..."
								aria-label="Search posts"
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value || undefined)
								}
							/>
							{field.state.value && (
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										size="icon-xs"
										aria-label="Clear search"
										onClick={() => field.handleChange(undefined)}
									>
										<Icon icon={XIcon} />
									</InputGroupButton>
								</InputGroupAddon>
							)}
						</InputGroup>
					)}
				</form.Field>
			</SidebarHeader>

			<SidebarContent className="divide-sidebar-border gap-0 divide-y">
				<FilterSidebarItem
					label="Display"
					accessory={
						isFiltered && (
							<Button
								variant="ghost"
								size="xs"
								className="text-primary"
								onClick={() => {
									form.reset({});
									setQuery({});
								}}
							>
								Reset all
							</Button>
						)
					}
				>
					<div className="flex flex-col gap-2">
						<form.Field name="sort.direction">
							{(field) => (
								<Select
									items={sortDirectionItems}
									value={field.state.value ?? sort.direction}
									onValueChange={(value: "asc" | "desc" | null) => {
										if (value) field.handleChange(value);
									}}
								>
									<SelectTrigger className="w-full" aria-label="Sort order">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{sortDirectionItems.map((item) => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						</form.Field>

						<form.Field name="paginate.maxPageSize">
							{(field) => (
								<Select
									items={pageSizeItems}
									value={field.state.value ?? paginate.maxPageSize}
									onValueChange={(value: number | null) => {
										if (value) field.handleChange(value);
									}}
								>
									<SelectTrigger className="w-full" aria-label="Posts per page">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{pageSizeItems.map((item) => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						</form.Field>
					</div>
				</FilterSidebarItem>

				<FilterSidebarItem label="Published">
					<div className="flex flex-col gap-2">
						{(
							[
								{ name: "filter.from", label: "From" },
								{ name: "filter.to", label: "To" },
							] as const
						).map(({ name, label }) => (
							<form.Field key={name} name={name}>
								{(field) => (
									<Field className="gap-1">
										<FieldLabel
											htmlFor={name}
											className="text-muted-foreground text-xs font-normal"
										>
											{label}
										</FieldLabel>
										<Input
											id={name}
											type="date"
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(e.target.value || undefined)
											}
										/>
									</Field>
								)}
							</form.Field>
						))}
					</div>
				</FilterSidebarItem>

				<form.Field name="feeds">
					{(field) => {
						/** only explicitly selected sources are checked. none checked means every source */
						const selected = field.state.value ?? [];

						return (
							<FilterSidebarItem
								label={`Sources (${selected.length ? `${selected.length}/${feeds.length}` : "all"})`}
								accessory={
									selected.length > 0 && (
										<Button
											variant="ghost"
											size="xs"
											className="text-primary"
											onClick={() => field.handleChange(undefined)}
										>
											Clear
										</Button>
									)
								}
							>
								<ul className="-mx-2 flex flex-col">
									{feeds.map((feed) => (
										<li
											key={feed.slug}
											className="group/source hover:bg-sidebar-accent flex items-center gap-2 rounded-md px-2 py-1"
										>
											<Checkbox
												id={`source-${feed.slug}`}
												checked={selected.includes(feed.slug)}
												onCheckedChange={(checked) => {
													/** rebuild from the canonical feed list so the order stays stable */
													const next = feeds
														.filter((candidate) =>
															candidate.slug === feed.slug
																? checked
																: selected.includes(candidate.slug),
														)
														.map((candidate) => candidate.slug);
													/** keep the query sparse: no selection is the default */
													field.handleChange(next.length ? next : undefined);
												}}
											/>
											<label
												htmlFor={`source-${feed.slug}`}
												className="min-w-0 flex-1 cursor-pointer truncate py-0.5 text-sm"
												title={feed.name}
											>
												{feed.name}
											</label>
											<Button
												variant="ghost"
												size="xs"
												className="text-primary opacity-0 group-hover/source:opacity-100 focus-visible:opacity-100"
												aria-label={`Show only ${feed.name}`}
												onClick={() => field.handleChange([feed.slug])}
											>
												Only
											</Button>
										</li>
									))}
								</ul>
							</FilterSidebarItem>
						);
					}}
				</form.Field>
			</SidebarContent>

			<SidebarFooter className="border-sidebar-border gap-2 border-t p-3">
				<span className="text-muted-foreground text-center text-xs">
					{!results ? (
						"Loading..."
					) : results.pagination.totalItems === 0 ? (
						"No posts"
					) : (
						<>
							<span className="text-foreground font-semibold">
								{Intl.NumberFormat("en-us").formatRange(
									results.pagination.firstItemIndex + 1,
									results.pagination.lastItemIndex + 1,
								)}
							</span>
							{" of "}
							<span className="text-foreground font-semibold">
								{Intl.NumberFormat("en-us").format(
									results.pagination.totalItems,
								)}
							</span>
							{" posts"}
						</>
					)}
				</span>

				<form.Field name="paginate.page">
					{(field) => (
						<PaginationControl
							page={field.state.value ?? paginate.page}
							maxPage={Math.max(results?.pagination.totalPages ?? 1, 1)}
							onPageChange={(page) => field.handleChange(page)}
						/>
					)}
				</form.Field>
			</SidebarFooter>
		</>
	);
}
