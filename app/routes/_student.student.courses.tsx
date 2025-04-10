import { redirect } from "react-router";
import { isStudentLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_student.student.courses";


export async function loader({ request }: Route.LoaderArgs) {
    const { isLoggedIn, student } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }
    //TODO: load student courses which they are assigend to + are publicly avaible for now just publicly availabale courses
    return null;
}

export default function StudentCourses() {
    return <div>StudentCourses</div>;
}