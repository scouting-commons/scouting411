import { faSquareUpRight } from "@fortawesome/free-solid-svg-icons";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/util/cn";

export function NavLink({
	href,
	label,
	newTab,
	currentUrl,
	icon,
	color,
}: {
	href: string;
	label: string;
	newTab?: boolean;
	currentUrl: URL;
	icon: FontAwesomeIconProps["icon"];
	/** the icon's color, muted if unset */
	color?: string;
}) {
	const isActive = currentUrl.pathname === href;

	return (
		<SidebarMenuButton
			isActive={isActive}
			className={cn(
				"h-auto justify-between gap-2.5 rounded-md border-transparent px-2.5 py-1.5 text-sm font-normal outline-none",
			)}
			render={
				<a
					href={href}
					target={newTab ? "_blank" : undefined}
					rel={newTab ? "noopener noreferrer" : undefined}
				>
					<div className="flex items-center gap-2">
						<FontAwesomeIcon
							icon={icon}
							size="sm"
							className={cn(!color && "text-sidebar-foreground/70")}
							style={{ color }}
						/>
						{label}
					</div>
					{newTab && <FontAwesomeIcon icon={faSquareUpRight} size="sm" />}
				</a>
			}
		/>
	);
}
