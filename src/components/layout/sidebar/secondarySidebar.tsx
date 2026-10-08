import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	type Ref,
} from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/util/hooks/use-mobile";
import { cn } from "@/util/cn";
import { Icon } from "@/components/react/icon";

const SecondarySidebarContext = createContext<{
	label: string;
	openSheet: () => void;
} | null>(null);

/**
 * from md up, fills the viewport below the app header, so the page itself
 * never scrolls: the content and the sidebar each scroll on their own, and
 * `contentRef` points at the content's scroll container. on mobile the sidebar
 * moves into a sheet, which the content opens with a `SecondarySidebarTrigger`,
 * and the page scrolls normally. ctrl+alt+b toggles the sidebar in either mode
 */
export function SecondarySidebar({
	children,
	sidebar,
	label,
	contentRef,
}: {
	children: ReactNode;
	sidebar: ReactNode;
	label: string;
	contentRef?: Ref<HTMLDivElement>;
}) {
	const isMobile = useIsMobile();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [desktopOpen, setDesktopOpen] = useState(true);

	useHotkey("Mod+Alt+B", () => {
		if (isMobile) setSheetOpen((open) => !open);
		else setDesktopOpen((open) => !open);
	});

	return (
		<SecondarySidebarContext
			value={{ label, openSheet: () => setSheetOpen(true) }}
		>
			<div className="flex md:h-[calc(100svh-var(--spacing-header))]">
				<div
					ref={contentRef}
					className="flex min-w-0 flex-1 flex-col md:overflow-y-auto"
				>
					{children}
				</div>

				{/* render the sidebar once, so it holds one copy of its state */}
				{isMobile ? (
					<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
						<SheetContent
							showCloseButton={false}
							className="bg-sidebar text-sidebar-foreground gap-0"
						>
							<SheetTitle className="sr-only">{label}</SheetTitle>
							{sidebar}
						</SheetContent>
					</Sheet>
				) : (
					// hidden below md too, so mobile doesn't flash it before hydration
					<aside
						aria-label={label}
						className={cn(
							"bg-sidebar text-sidebar-foreground border-sidebar-border hidden w-64 shrink-0 flex-col border-l",
							desktopOpen && "md:flex",
						)}
					>
						{sidebar}
					</aside>
				)}
			</div>
		</SecondarySidebarContext>
	);
}

/** opens the sidebar sheet on mobile. hidden from md up, where the sidebar is always shown */
export function SecondarySidebarTrigger() {
	const context = useContext(SecondarySidebarContext);

	if (!context) {
		throw new Error(
			"SecondarySidebarTrigger must be inside a SecondarySidebar",
		);
	}

	return (
		<Button
			variant="outline"
			size="sm"
			className="md:hidden"
			onClick={context.openSheet}
		>
			<Icon icon={SlidersHorizontalIcon} />
			{context.label}
		</Button>
	);
}
