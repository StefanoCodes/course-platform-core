import { data, type ActionFunctionArgs } from "react-router"
import { handleCreateSegment, handleEditSegment, handleDeleteSegment, handleMakeSegmentPrivate, handleMakeSegmentPublic } from "~/lib/admin/actions/segment/segment.server"


const intents = ["create-segment", "edit-segment", "delete-segment", "make-segment-private", "make-segment-public"]

export async function loader() {
    return data('Not Allowed', { status: 405 })
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get('intent') as string

    console.log("intent", intent)

    if (!intent || !intents.includes(intent)) {
        return data({ success: false, message: 'Invalid form submission' }, { status: 400 })
    }
    try {
        const handlers = {
            'create-segment': handleCreateSegment,
            'edit-segment': handleEditSegment,
            'delete-segment': handleDeleteSegment,
            'make-segment-private': handleMakeSegmentPrivate,
            'make-segment-public': handleMakeSegmentPublic,
        } as const

        const handler = handlers[intent as keyof typeof handlers]
        return handler(request, formData)
    } catch (error) {
        console.error('Action error:', error)
        return data({ success: false, message: 'An unexpected error occurred' }, { status: 500 })
    }
}
