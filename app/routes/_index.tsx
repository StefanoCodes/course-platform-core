import { redirect } from "react-router";

export async function loader() {
	throw redirect("/login");
}

export default function MarketingPage() {
	return <div>Marketing Page</div>;
}
