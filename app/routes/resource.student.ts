import { data, type ActionFunctionArgs } from "react-router"
import { handleActivateStudent, handleCreateStudent, handleDeactivateStudent, handleUpdateStudent, handleUpdateStudentPassword } from "~/lib/actions/student/student.server"


const intents = ["create-student", "activate-student", "deactivate-student", "update-student", "update-student-password"]

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
            'create-student': handleCreateStudent,
            'activate-student': handleActivateStudent,
            'deactivate-student': handleDeactivateStudent,
            'update-student': handleUpdateStudent,
            'update-student-password': handleUpdateStudentPassword,
        } as const

        const handler = handlers[intent as keyof typeof handlers]
        return handler(request, formData)
    } catch (error) {
        console.error('Action error:', error)
        return data({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}

