import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import type { Student } from "~/db/schema";

type FetcherResponse = {
    success:boolean,
    students:Student[],
}
export function StudentEnrolledList({courseSlug}:{
    courseSlug:string
}) {
    const fetcher = useFetcher<FetcherResponse>();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        if(!fetcher.data?.students) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
        fetcher.load(`/resource/student-list/${courseSlug}`);
      }, [fetcher.data]);
    
    return (
        <Dialog>
        <DialogTrigger asChild>
                
        <Button variant={"link"}>
            See students enrolled
        </Button>
                
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-8 overflow-hidden">
            <DialogHeader>
                <DialogTitle>Student List</DialogTitle>
            </DialogHeader>
        {isLoading && <p>Loading Student List...</p>}
        {!isLoading && <div className="flex flex-col gap-4 max-h-[400px] overflow-x-auto">
          {fetcher.data && fetcher.data.students && fetcher.data.students.map((student ) => (<div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{student.name}</p>
            
          </div>) ) }
            </div>}
        </DialogContent>
    </Dialog>
    )
}