import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import type { FetcherResponse } from "~/lib/types";

export function DeleteCourse({ courseId }: { courseId: string }) {
    const fetcher = useFetcher<FetcherResponse>();
    const isSubmitting = fetcher.state !== 'idle';
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                toast.success(fetcher.data.message);
                setIsDialogOpen(false)
            }
            if (!fetcher.data.success) {
                toast.error(fetcher.data.message);
            }
        }
    }, [fetcher.data])
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" className="cursor-pointer hover:bg-transparent w-auto h-10" disabled={isSubmitting}>
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100">
                        <X className="w-4 h-4 text-red-400" />
                    </div>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <fetcher.Form className="flex flex-col gap-4" method="POST" action="/resource/course" onSubmit={(e) => {
                    e.preventDefault();
                    fetcher.submit({
                        courseId,
                        intent: 'delete-course',
                    }, {
                        method: 'POST',
                        action: '/resource/course',
                    })
                }}>
                    <DialogHeader>
                        <DialogTitle>Delete Course</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to delete this course? <br /> This action cannot be undone.</DialogDescription>
                    <DialogFooter>
                        <Button type="submit" onClick={() => {
                            console.log("clicked")
                        }} variant="destructive" className="cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </Button>
                    </DialogFooter>
                </fetcher.Form>
            </DialogContent>

        </Dialog>

    )
}