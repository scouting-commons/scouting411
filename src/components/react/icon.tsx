import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/util/cn";

/** Renders a lucide icon sized and aligned to the surrounding text, so it sits inline or in a flex row without extra classes. */
export function Icon({
	icon: LucideIcon,
	small,
	className,
	...props
}: LucideProps & {
	icon: LucideIcon;
	/** 0.875em instead of 1em */
	small?: boolean;
}) {
	return (
		<LucideIcon
			className={cn(
				"inline-block shrink-0 align-[-0.125em]",
				small ? "size-[0.875em]" : "size-[1em]",
				className,
			)}
			{...props}
		/>
	);
}
