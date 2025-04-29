import { useLocation } from "react-router";
import { useEditorLoaderData } from "~/routes/_dashboard._editor";
import { SegmentListItem } from "./segment-list-item";

export function SegmentsList() {
	const { segments, courseSlug } = useEditorLoaderData();

	const location = useLocation();
	const pathname = location.pathname;

	return (
		<div className="flex-1 relative h-full overflow-y-auto [scrollbar-width:thin]">
			<nav className="h-full w-full">
				<ul className="space-y-2 w-full">
					{segments.map((segment) => {
						const isActive =
							pathname === `/dashboard/courses/${courseSlug}/${segment.slug}`;
						return (
							<SegmentListItem
								key={segment.id}
								segment={segment}
								courseSlug={courseSlug}
								isActive={isActive}
							/>
						);
					})}
				</ul>
				{/* Gradient mask to indicate scrollable content */}
				<div
					className="sticky bottom-0 left-0 right-0 h-16 pointer-events-none"
					style={{
						background:
							"linear-gradient(to bottom, transparent, rgb(249 250 251) 100%)",
					}}
				/>
			</nav>
		</div>
	);
}
