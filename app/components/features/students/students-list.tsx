import { DataTable } from "~/components/global/admin/data-table";
import { useStudentsLoaderData } from "~/routes/_dashboard.dashboard.students";

export function StudentsList() {
	const { students } = useStudentsLoaderData();
	return <DataTable initialData={students} />;
}
