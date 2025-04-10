import { data, type ActionFunctionArgs } from "react-router"
import { handleSignInAdmin, handleSignInStudent, handleSignOut } from "~/lib/admin/actions/auth/auth.server"


const intents = ["sign-in-admin", "sign-in-student", "sign-out"]

export async function loader() {
    return data('Not Allowed', { status: 405 })
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get('intent') as string

    if (!intent || !intents.includes(intent)) {
        return data({ success: false, message: 'Invalid form submission' }, { status: 400 })
    }

    try {
        const handlers = {
            'sign-in-admin': handleSignInAdmin,
            'sign-in-student': handleSignInStudent,
            'sign-out': handleSignOut,
        } as const

        const handler = handlers[intent as keyof typeof handlers]
        return handler(request, formData)
    } catch (error) {
        console.error('Action error:', error)
        return data({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}
