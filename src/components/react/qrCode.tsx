import QRCode from "qrcode";
import { cn } from "@/util/cn";

/** blank modules around the code, which scanners need to find its edges */
const quietZone = 4;

/**
 * A QR code for `value`, drawn as an svg so it stays sharp at any size and in print.
 * Always black on white, whatever the theme, so it scans. Size it with `className`.
 */
export function QrCode({
	value,
	className,
}: {
	value: string;
	className?: string;
}) {
	const { size, data } = QRCode.create(value, {
		errorCorrectionLevel: "M",
	}).modules;

	// one 1x1 square per dark module, all in a single path
	const path = Array.from(data)
		.flatMap((dark, index) =>
			dark ? [`M${index % size} ${Math.floor(index / size)}h1v1h-1z`] : [],
		)
		.join("");

	const side = size + quietZone * 2;

	return (
		<svg
			viewBox={`${-quietZone} ${-quietZone} ${side} ${side}`}
			shapeRendering="crispEdges"
			role="img"
			aria-label={`QR code for ${value}`}
			className={cn("bg-white", className)}
		>
			<path d={path} fill="black" />
		</svg>
	);
}
