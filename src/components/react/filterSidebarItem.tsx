export function FilterSidebarItem({
	label,
	children,
	accessory,
}: {
	label: string;
	children: React.ReactNode;
	accessory?: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-2.5 px-4 py-4">
			<div className="flex h-6 items-center justify-between gap-2">
				<h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
					{label}
				</h2>
				{accessory}
			</div>
			{children}
		</section>
	);
}
