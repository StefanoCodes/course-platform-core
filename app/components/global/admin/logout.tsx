import { LogOut } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import type { FetcherResponse } from "~/lib/types";
import { cn } from "~/lib/utils";

export function LogoutProvider({ children, className }: { children?: React.ReactNode, className?: string }) {
    const fetcher = useFetcher<FetcherResponse>({ key: "sign-out" });
    const isPending = fetcher.state !== "idle";
    return (
        <fetcher.Form
            method="POST"
            onSubmit={(e) => {
                e.preventDefault();
                fetcher.submit(
                    {
                        intent: "sign-out",
                    },
                    {
                        action: "/resource/auth",
                        method: "POST",
                    }
                );
            }}
        >

            <Button variant={"outline"} className={cn("cursor-pointer", className)} type="submit" disabled={isPending}>
                {children ? children : (
                    <>
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Log out</span>
                    </>
                )}
            </Button>

        </fetcher.Form>
    );
}