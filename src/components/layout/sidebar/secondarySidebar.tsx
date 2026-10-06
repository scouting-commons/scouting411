import type { ReactNode, Ref } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

/**
 * fills the viewport below the app header, so the page itself never scrolls:
 * the content and the sidebar each scroll on their own. `contentRef` points at
 * the content's scroll container
 */
export function SecondarySidebar({
	children,
	sidebar,
	contentRef,
}: {
	children: ReactNode;
	sidebar: ReactNode;
	contentRef?: Ref<HTMLDivElement>;
}) {
	return (
		<SidebarProvider className="h-[calc(100svh-(--spacing(13)))] min-h-0 overflow-hidden">
			<div
				ref={contentRef}
				className="flex min-w-0 flex-1 flex-col overflow-y-auto"
			>
				{children}
			</div>
			<Sidebar
				side="right"
				collapsible="none"
				className="border-sidebar-border border-l"
				aria-label="Secondary sidebar"
			>
				{sidebar}
			</Sidebar>
		</SidebarProvider>
	);
}
