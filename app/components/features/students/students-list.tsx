import { DataTable } from "~/components/ui/data-table";
import type { Student } from "~/db/schema";
import { formatDateToString } from "~/lib/utils";
import { useStudentsLoaderData } from "~/routes/_dashboard.dashboard.students";
import { ActivateStudent } from "./activate-student";
import { DeactivateStudent } from "./deactivate-student";
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
            {!student.isActivated && <ActivateStudent studentId={student.studentId} />}
            {student.isActivated && <DeactivateStudent studentId={student.studentId} />}
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
