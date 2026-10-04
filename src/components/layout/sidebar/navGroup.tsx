import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const labelClassName =
	"h-auto rounded-none p-0 pl-3 text-xs font-bold uppercase";

export function NavGroup({
	label,
	collapsible,
	defaultOpen = true,
	children,
}: {
	label?: string;
	/** Requires a `label` — the label is the trigger. */
	collapsible?: boolean;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	const menu = (
		<SidebarMenu className="gap-0.5">
			{React.Children.map(children, (child) => (
				<SidebarMenuItem>{child}</SidebarMenuItem>
			))}
		</SidebarMenu>
	);

	if (!label || !collapsible) {
		return (
			<SidebarGroup className="gap-1 p-0 px-3">
				{label && (
					<SidebarGroupLabel className={labelClassName}>
						{label}
					</SidebarGroupLabel>
				)}
				<SidebarGroupContent>{menu}</SidebarGroupContent>
			</SidebarGroup>
		);
	}

	return (
		<Collapsible defaultOpen={defaultOpen}>
			<SidebarGroup className="gap-1 p-0 px-3">
				<SidebarGroupLabel
					render={<CollapsibleTrigger />}
					className={`${labelClassName} group/trigger hover:text-sidebar-foreground flex w-full cursor-pointer items-center justify-start gap-2 pr-3`}
				>
					<FontAwesomeIcon
						icon={faChevronRight}
						size="sm"

						className="transition-transform duration-200 group-data-panel-open/trigger:rotate-90"
					/>
					{label}
				</SidebarGroupLabel>
				<CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
					<SidebarGroupContent>{menu}</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	);
}
