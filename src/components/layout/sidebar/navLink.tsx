import { SquareArrowOutUpRightIcon, type LucideIcon } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/util/cn";
import { Icon } from "@/components/react/icon";

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
	icon: LucideIcon;
	/** the icon's color, muted if unset */
	color?: string;
}) {
	// subpages keep their parent link active
	const { pathname } = currentUrl;
	const isActive =
		pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

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
						<Icon
							icon={icon}
							className={cn(!color && "text-sidebar-foreground/70")}
							style={{ color }}
						/>
						{label}
					</div>
					{newTab && <Icon icon={SquareArrowOutUpRightIcon} />}
				</a>
			}
		/>
	);
}
