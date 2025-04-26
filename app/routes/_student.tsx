import { Outlet, redirect, useNavigation, useRouteLoaderData } from "react-router";
import { StudentNavbar } from "~/components/global/student/navbar";
import { CourseCardSkeleton } from "~/components/global/student/student-skeleton";
import { isStudentLoggedIn } from "~/lib/auth.server";
import { getStudentById } from "~/lib/student/data-access/students.server";
import type { Route } from "./+types/_student";

export async function loader({ request }: Route.LoaderArgs) {
    // student auth check
    const { isLoggedIn, student } = await isStudentLoggedIn(request);
    if (!isLoggedIn || !student) {  
        throw redirect('/login');
    }
    // get studentbyid
    const { student: studentById } = await getStudentById(request, student.id);
    if(!studentById) {
        throw redirect("/login")
    }
    return { student: studentById };
}
export function useStudentLayoutData() {
    const data = useRouteLoaderData<typeof loader>("routes/_student");
    if(!data) {
        throw new Error("Cannot use student layout data outside of the student layout context the route must be a child of the student layout");
    }
    return data;
}
export default function StudentLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state !== "idle"
    return (
        <main>
        <StudentNavbar />
        <div className="min-h-[calc(100dvh-var(--navbar-height))]">
           {!isLoading ? <Outlet /> : <CourseCardSkeleton/>} 
        </div>
        </main>
    )
}

