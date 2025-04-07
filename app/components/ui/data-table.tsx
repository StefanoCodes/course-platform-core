import { Link } from 'react-router';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { cn } from '~/lib/utils';


interface Column<T> {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
}

interface DataTableItem {
    id: string;
    studentId: string;
    [key: string]: unknown;
}

interface DataTableProps<T extends DataTableItem> {
    data: T[];
    columns: Column<T>[];
    title: string;
    actions?: (item: T) => React.ReactNode;
    linkPath?: string;
    linkQueryParam?: string;
}

export function DataTable<T extends DataTableItem>({
    data,
    columns,
    title,
    actions,
    linkPath,
    linkQueryParam,
}: DataTableProps<T>) {
    return (
        <div className='flex flex-col gap-8 overflow-hidden'>
            <div className="flex  items-center gap-2 self-center rounded-full border border-input bg-background/50 px-3 py-2">
                <h2 className="text-center text-muted-foreground">{title}</h2>
                <span className="inline-flex h-5 items-center rounded border border-border px-1 font-medium text-[0.625rem] text-muted-foreground">
                    {data.length}
                </span>
            </div>

            <div className="w-full rounded-lg border border-border bg-background relative overflow-auto [scrollbar-width:thin]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            {columns.map((column) => (
                                <TableHead
                                    key={String(column.accessorKey)}
                                    className={cn(`h-9 py-2`, column.accessorKey === 'name' &&
                                        'sticky left-0 bg-muted font-medium xl:static xl:bg-inherit'
                                    )
                                    }
                                >
                                    {column.header}
                                </TableHead>
                            ))}

                            {actions && <TableHead className="h-9 py-2">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={String(column.accessorKey)}
                                        className={`py-5 ${column.accessorKey === 'name' ||
                                            column.accessorKey === 'studentName'
                                            ? 'sticky left-0 z-10 bg-muted font-medium xl:static xl:bg-inherit'
                                            : ''
                                            }`}
                                    >
                                        {column.accessorKey === 'name' ||
                                            (column.accessorKey === 'studentName' && linkPath) ? (
                                            <Link
                                                className="hover:underline"
                                                to={`${linkPath}/${item.studentId}${linkQueryParam ? `?${linkQueryParam}` : ''}`}
                                            >
                                                {String(item[column.accessorKey])}
                                            </Link>
                                        ) : column.cell ? (
                                            column.cell(item)
                                        ) : (
                                            <>{String(item[column.accessorKey])}</>
                                        )}
                                    </TableCell>
                                ))}

                                {actions && <TableCell>{actions(item)}</TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>

    );
} 