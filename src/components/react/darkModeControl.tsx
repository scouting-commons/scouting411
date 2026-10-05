import * as React from "react";
import { Moon, Sun, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";

/** persistently stores the user's theme preference. */
const $theme = persistentAtom<"light" | "dark" | "system">("theme", "system");

export function useTheme() {
	const theme = useStore($theme);
	const setTheme = $theme.set;
	return { theme, setTheme };
}

// NOTE: there is a script in the root layout that handles actually setting the theme on page load / navigation

export function DarkModeControl() {
	const { theme, setTheme } = useTheme();

	// when the theme changes, sync the class to the document
	React.useEffect(() => {
		const isDark =
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		document.documentElement.classList[isDark ? "add" : "remove"]("dark");
	}, [theme]);

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger
					render={
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon-xs"
									className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-transparent aria-expanded:bg-transparent"
								>
									<Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
									<Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
									<span className="sr-only">Toggle theme</span>
								</Button>
							}
						/>
					}
				/>
				<TooltipContent>Toggle theme</TooltipContent>
			</Tooltip>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className="flex flex-row items-center justify-between"
				>
					Light
					{theme === "light" && <Check className="ml-2 h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className="flex flex-row items-center justify-between"
				>
					Dark
					{theme === "dark" && <Check className="ml-2 h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className="flex flex-row items-center justify-between"
				>
					System
					{theme === "system" && <Check className="ml-2 h-4 w-4" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
