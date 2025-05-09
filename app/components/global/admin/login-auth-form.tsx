import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { redirect, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { loginSchema } from "~/lib/zod-schemas/auth";
import type { LoginSchema } from "~/lib/zod-schemas/auth";
import type { FetcherResponse } from "~/lib/types";

export default function LoginAuthForm({ type }: { type: "admin" | "student" }) {
	const navigate = useNavigate();
	const config =
		type === "admin"
			? {
					action: "/resource/auth",
					intent: "sign-in-admin",
					buttonStyles:
						"bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white cursor-pointer h-10 font-medium",
				}
			: {
					action: "/resource/auth",
					intent: "sign-in-student",
					buttonStyles:
						"bg-gradient-to-br from-brand-primary to-brand-primary/90  text-white cursor-pointer h-10 font-medium",
				};
	const fetcher = useFetcher<FetcherResponse>();
	const isPending = fetcher.state !== "idle";
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	// trigger toast when fetcher data sent back from the server
	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.success) {
				toast.success(fetcher.data.message);
			}
			if (fetcher.data.success === false) {
				toast.error(fetcher.data.message);
				if (fetcher.data.redirectTo) {
					navigate(fetcher.data.redirectTo);
				}
			}
		}
	}, [fetcher.data]);

	return (
		<div className="rounded-lg bg-gray-100 p-6 md:p-8 inset-ring-border">
			<Form {...form}>
				<fetcher.Form
					action={config.action}
					method="POST"
					onSubmit={form.handleSubmit((data) => {
						fetcher.submit(
							{
								...data,
								intent: config.intent,
							},
							{
								action: config.action,
								method: "POST",
							},
						);
					})}
				>
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-6">
							<FormField
								control={form.control}
								name="email"
								disabled={isPending}
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor="email"
											className="font-serif text-gray-900"
										>
											Email
										</FormLabel>
										<Input
											type="email"
											id="email"
											placeholder="example@gmail.com"
											className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
											{...field}
										/>
										<FormMessage className="text-red-600" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								disabled={isPending}
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor="password"
											className="font-serif text-gray-900"
										>
											Password
										</FormLabel>
										<Input
											type="password"
											id="password"
											placeholder="*********"
											className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
											{...field}
										/>
										<FormMessage className="text-red-600" />
									</FormItem>
								)}
							/>
						</div>
						<Button
							type="submit"
							disabled={isPending}
							className={config.buttonStyles}
						>
							{isPending ? "Logging in..." : "Login"}
						</Button>
					</div>
				</fetcher.Form>
			</Form>
		</div>
	);
}
