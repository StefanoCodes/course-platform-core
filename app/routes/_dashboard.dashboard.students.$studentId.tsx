import { GetStudentById } from "~/lib/data-access/students.server";
import type { Route } from "./+types/_dashboard.dashboard.students.$studentId";
import { data } from "react-router";
import { redirect } from "react-router";

export async function loader({ request, params }: Route.LoaderArgs) {
    const { studentId } = params;
    if (!studentId) throw redirect("/dashboard/students")
    const { success, student } = await GetStudentById(request, studentId as string)
    if (!success || !student) throw redirect("/dashboard/students")
    return data({ success: true, student }, { status: 200 })
}

// display data
export default function StudentProfilePage({ loaderData }: Route.ComponentProps) {
    const { student } = loaderData
    console.log(student)
    return (
        <div>
            <h1>Student Profile</h1>
            <p>{student.name}</p>
            <p>{student.email}</p>
            <p>{student.phone}</p>
        </div>
    )
}


