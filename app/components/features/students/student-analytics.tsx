import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useDashboardLoaderData } from "~/routes/_dashboard.dashboard";

export function StudentAnalytics() {
    const { totalStudentsCount, activeStudentsCount, inactiveStudentsCount } = useDashboardLoaderData();
    return (
        <div className="flex flex-col gap-4 pb-4">
            <h2 className="text-2xl">Students Analytics Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnalyticsCard
                    title="Total Students"
                    value={totalStudentsCount}
                    icon={Users}
                    description="All registered students"
                />
                <AnalyticsCard
                    title="Active Students"
                    value={activeStudentsCount}
                    icon={Users}
                    description="All active students"
                />
                <AnalyticsCard
                    title="Inactive Students"
                    value={inactiveStudentsCount}
                    icon={Users}
                    description="All inactive students"
                />
            </div>
        </div>
    )
}

function AnalyticsCard({
    title,
    value,
    icon: Icon,
    description
}: {
    title: string,
    value: number,
    icon: React.ElementType,
    description: string
}) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-blue-500">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}
