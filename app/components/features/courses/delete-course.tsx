import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DeleteDialog } from "~/components/global/admin/delete-dialog";

export function DeleteCourse({ courseId }: { courseId: string }) {
    return (
        <DeleteDialog
            resourceRoute="/resource/course"
            resourceId={courseId}
            intent="delete-course"
            title="Delete Course"
            description={
                <div className="text-sm text-gray-500">
                    Are you sure you want to delete this course?<br />
                    This action cannot be undone.
                </div>
            }
            trigger={
                <Button type="button" variant="ghost" className="cursor-pointer hover:bg-transparent w-auto h-10">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100">
                        <X className="w-4 h-4 text-red-400" />
                    </div>
                </Button>
            }
        />
    );
}