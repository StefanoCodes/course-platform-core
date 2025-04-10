import { createServerClient, parseCookieHeader, parse, serialize, serializeCookieHeader } from '@supabase/ssr'
export const createSupabaseServerClient = (request: Request) => {
    const headers = new Headers();
    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                // @ts-ignore
                getAll() {
                    return parseCookieHeader(request.headers.get("Cookie") ?? "") ?? {};
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        headers.append(
                            "Set-Cookie",
                            serializeCookieHeader(name, value, options)
                        )
                    );
                },
            },
        }
    );
    return { client: supabase, headers };
};

// export function createSupabaseServerClient(request: Request) {
//     const cookies = parse(request.headers.get("Cookie") ?? "");
//     const supabase = {
//         headers: new Headers(),
//         client: createServerClient(
//             process.env.SUPABASE_URL!,
//             process.env.SUPABASE_ANON_KEY!,
//             {
//                 cookies: {
//                     get(key) {
//                         return cookies[key];
//                     },
//                     set(key, value, options) {
//                         supabase.headers.append(
//                             "Set-Cookie",
//                             serialize(key, value, options)
//                         );
//                     },
//                     remove(key, options) {
//                         supabase.headers.append("Set-Cookie", serialize(key, "", options));
//                     },
//                 },

//             },

//         ),
//     };

//     return supabase;
// }

export function createSupabaseAdminClient(request: Request) {
    const cookies = parse(request.headers.get("Cookie") ?? "");
    const supabase = {
        headers: new Headers(),
        client: createServerClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    get(key) {
                        return cookies[key];
                    },
                    set(key, value, options) {
                        supabase.headers.append(
                            "Set-Cookie",
                            serialize(key, value, options)
                        );
                    },
                    remove(key, options) {
                        supabase.headers.append("Set-Cookie", serialize(key, "", options));
                    },
                },

            },

        ),
    };

    return supabase;
}
