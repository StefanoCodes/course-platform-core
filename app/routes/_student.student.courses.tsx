import { redirect } from "react-router";
import { isStudentLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_student.student.courses";
import { getStudentCourses } from "~/lib/student/data-access/students.server";


export async function loader({ request }: Route.LoaderArgs) {
    const { isLoggedIn } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }
    // get all public courses for the student
    const { courses } = await getStudentCourses(request);
    return {courses};
}

export default function StudentCourses({loaderData}:Route.ComponentProps) {
    const {courses} = loaderData;
    return (
        <div className="container mx-auto pt-20">
            <h1 className="text-center text-2xl font-bold">Student Courses</h1>
        </div>
    );
}