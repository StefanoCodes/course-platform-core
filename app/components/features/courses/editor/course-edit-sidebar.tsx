import { CreateSegment } from "../segments/create-segment";
import { SegmentsList } from "../segments/segments-list";

export function CourseEditSidebar() {
	return (
		<aside className="w-full md:w-64 h-full overflow-hidden bg-gray-50 md:border-r border-r-0 border-b md:border-b-0 border-gray-200 p-2 flex flex-col">
			<div className="h-full flex flex-col gap-4">
				<SegmentsList />
				<CreateSegment />
			</div>
		</aside>
	);
}
