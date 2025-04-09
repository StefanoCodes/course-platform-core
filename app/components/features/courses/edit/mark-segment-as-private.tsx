import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useFetcher } from "react-router"
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import type { FetcherResponse } from "~/lib/types";

export function MarkSegmentAsPrivate({ segmentId, courseSlug }: { segmentId: string, courseSlug: string }) {
    const fetcher = useFetcher<FetcherResponse>();
    const isSubmitting = fetcher.state !== 'idle';
    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                toast.success(fetcher.data.message);
            } else {
                toast.error(fetcher.data.message);
            }
        }
    }, [fetcher.data])
    return (
        <fetcher.Form method="post" action="/resource/segment" className="flex justify-center" onSubmit={(e) => {
            e.preventDefault();
            fetcher.submit({
                id: segmentId,
                courseSlug,
                intent: 'make-segment-private',
            }, {
                method: 'post',
                action: '/resource/segment',
            })
        }}>
            <Button type="submit" variant="outline" className="cursor-pointer min-w-[150px] self-center" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Make Private (Unlisted)'}
            </Button>
        </fetcher.Form>
    )
}