import type { ReactNode } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

export function SecondarySidebar({
	children,
	sidebar,
}: {
	children: ReactNode;
	sidebar: ReactNode;
}) {
	return (
		<SidebarProvider className="min-h-0">
			{children}
			<Sidebar
				side="right"
				collapsible="none"
				className="border-sidebar-border sticky top-13 h-[calc(100svh-(--spacing(13)))] overflow-y-scroll border-l"
				aria-label="Secondary sidebar"
			>
				{sidebar}
			</Sidebar>
		</SidebarProvider>
	);
}
