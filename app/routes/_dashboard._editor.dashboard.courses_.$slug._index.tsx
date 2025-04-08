import { FileText } from "lucide-react";
import type { Route } from "./+types/_dashboard._editor.dashboard.courses_.$slug._index";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { redirect } from "react-router";
export async function loader({ request }: Route.LoaderArgs) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login")
    }
}
export default function CourseIndex() {
    return (
        <div className="flex flex-col h-full bg-gray-50 p-8 flex-1 border border-gray-200 border-l-0 border-t-0 justify-center items-center text-center">
            <div>
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    Select a Segment to Begin
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                    Choose a segment from the sidebar to start editing your course content.
                    Each segment represents a different part of your course.
                </p>
            </div>
        </div>
    );
}

