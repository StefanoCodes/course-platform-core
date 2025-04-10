import { Outlet } from "react-router";

export default function StudentLayout() {
    return (
        <div className="flex flex-col gap-8">
            <p>Dashboard Layout</p>
            <Outlet />
        </div>
    )
}