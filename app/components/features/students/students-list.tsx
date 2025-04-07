import { DataTable } from "~/components/ui/data-table";
import { useStudentsLoaderData } from "~/routes/_dashboard.dashboard.students";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import type { Student } from "~/db/schema";
import { formatDateToString } from "~/lib/utils";
import { StatusBadge } from "./status-badge";

export function StudentsList() {
    const { students } = useStudentsLoaderData();

    const columns = [
        { header: 'Name', accessorKey: 'name' as const },
        { header: 'Email', accessorKey: 'email' as const },
        {
            header: 'Phone Number',
            accessorKey: 'phone' as const,
            cell: (student: Student) => student.phone || 'N/A'
        },
        {
            header: 'Status',
            accessorKey: 'isActivated' as const,
            cell: (student: Student) => <StatusBadge status={student.isActivated} />
        },
        {
            header: 'Created At',
            accessorKey: 'created_at' as const,
            cell: (student: Student) => formatDateToString(new Date(student.created_at))
        },
    ];

    const renderActions = (student: Student) => (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link to={`/dashboard/students/${student.id}/edit`}>Edit</Link>
            </Button>
        </div>
    );

    return (
        <div className="w-full overflow-auto flex-1">
            <DataTable
                data={students}
                columns={columns}
                title="Students"
                actions={renderActions}
                linkPath="/dashboard/students"
            />
        </div>
    );
}
