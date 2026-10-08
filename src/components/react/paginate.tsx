import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/react/icon";

export function PaginationControl({
	page,
	maxPage,
	onPageChange,
}: {
	page: number;
	maxPage: number;
	onPageChange: (page: number) => void;
}) {
	return (
		<div className="flex items-center justify-center gap-2 text-sm">
			<Button
				size="icon-sm"
				variant="ghost"
				onClick={() => onPageChange(page - 1)}
				disabled={page === 1}
			>
				<Icon icon={ChevronLeftIcon} />
				<span className="sr-only">Previous page</span>
			</Button>
			<span>{"Page "}</span>
			<Input
				type="number"

				min={1}
				className="h-8 w-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				value={page}
				onChange={(e) => onPageChange(e.target.valueAsNumber)}
			/>
			{"of"}

			<span className="font-bold">{maxPage}</span>

			<Button
				size="icon-sm"
				variant="ghost"
				onClick={() => onPageChange(page + 1)}
				disabled={page === maxPage}
			>
				<Icon icon={ChevronRightIcon} />
				<span className="sr-only">Next page</span>
			</Button>
		</div>
	);
}
