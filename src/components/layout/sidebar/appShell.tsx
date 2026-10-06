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
					<header className="bg-background h-header fixed top-0 z-10 flex w-full shrink-0 items-center gap-3 border-b px-4">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									render={
										<SidebarTrigger className="md:hidden" variant="ghost" />
									}
								/>
								<TooltipContent>Toggle sidebar</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<span className="text-sm font-medium">{title}</span>
					</header>
					<div className="mt-header">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
