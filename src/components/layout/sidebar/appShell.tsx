import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/sidebar/appSidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { CommandPalette } from "@/components/react/commandPalette";

import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";

export function AppShell({
	url,
	title,
	children,
}: {
	url: URL;
	title: string;
	children: ReactNode;
}) {
	return (
		<>
			<CommandPalette />
			<SidebarProvider>
				<AppSidebar url={url} />
				<SidebarInset>
					<header className="bg-sidebar fixed top-0 z-10 flex h-13 w-full shrink-0 items-center gap-4 border-b px-4">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									render={
										<SidebarTrigger className="md:hidden" variant="outline" />
									}
								/>
								<TooltipContent>Toggle sidebar</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<span className="font-serif font-bold">{title}</span>
					</header>
					<div className="mt-13">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
