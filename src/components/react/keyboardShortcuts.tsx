import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";

/** every shortcut on the site; update this when a hotkey is added or changed */
const shortcuts: { keys: string[][]; description: string }[] = [
	{ keys: [["Ctrl", "K"], ["/"]], description: "Open the launcher" },
	{ keys: [["Ctrl", "B"]], description: "Toggle the sidebar" },
	{
		keys: [["Ctrl", "Alt", "B"]],
		description: "Toggle the secondary sidebar",
	},
	{ keys: [["Ctrl", "/"], ["F1"]], description: "Show keyboard shortcuts" },
];

/** mount once to wire up the hotkeys that open the keyboard shortcuts dialog */
export function KeyboardShortcuts() {
	const [open, setOpen] = useState(false);

	useHotkey("Mod+/", () => setOpen(true));
	useHotkey("F1", () => setOpen(true));

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Keyboard shortcuts</DialogTitle>
				</DialogHeader>
				<dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
					{shortcuts.map((shortcut) => (
						<div key={shortcut.description} className="contents">
							<dt>{shortcut.description}</dt>
							<dd className="text-muted-foreground flex items-center justify-end gap-1.5 text-xs">
								{shortcut.keys.map((combo, i) => (
									<span key={combo.join("+")} className="contents">
										{i > 0 && "or"}
										<KbdGroup>
											{combo.map((key) => (
												<Kbd key={key}>{key}</Kbd>
											))}
										</KbdGroup>
									</span>
								))}
							</dd>
						</div>
					))}
				</dl>
			</DialogContent>
		</Dialog>
	);
}
