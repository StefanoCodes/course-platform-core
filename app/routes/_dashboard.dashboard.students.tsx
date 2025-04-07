import { redirect, useNavigation, useRouteLoaderData } from "react-router";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_dashboard.dashboard.students";
import { CreateStudent } from "~/components/features/students/create-student";
import { StudentsList } from "~/components/features/students/students-list";
import { TableSkeleton } from "~/components/features/loading/dashboard-skeleton";
import { GetAllStudents } from "~/lib/data-access/students.server";

export async function loader({ request }: Route.LoaderArgs) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/admin/login')
    }
    const { success, students } = await GetAllStudents(request)
    if (!success) {
        return { students: [] }
    }
    return { students }
}

export function useStudentsLoaderData() {
    const data = useRouteLoaderData<typeof loader>("routes/_dashboard.dashboard.students")
    if (!data) throw new Error("Cannot use students loader data if the route is not a child of the students route")
    return data
}


export default function Page() {
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex flex-row justify-between w-full ">
                <h1>Students</h1>
                <CreateStudent />
            </div>
            <StudentsList />
        </div>
    )
}
