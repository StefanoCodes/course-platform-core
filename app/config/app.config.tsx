
export const features = [
    {
      step: 'Step 1',
      title: <h3 className="font-bold">Create Your Student</h3>,
      content: <p>Fill in the student information & assign them to courses</p>,
      image: '/assets/create-student-dialog-pt1.png',
    },
    {
      step: 'Step 2',
      title: <h3 className="font-bold">Copy Their Credetials</h3>,
      content: (
        <p className="text-sm md:text-lg">Send them their credentials to login into the platform</p>
      ),
      image: '/assets/create-student-dialog-pt2.png',
    },
    {
      step: 'Step 3',
      title: <h3 className="font-bold">Share it to them!</h3>,
      content: (
        <p className="text-sm md:text-lg">
          Its That easy! <span className="font-bold"> Now they can access the course.</span>
        </p>
      ),
      image: '/assets/student-view-of-courses.png',
    },
  ]

export const features2 = [
    {
      step: 'Step 1',
      title: <h3 className="font-bold">Create Your Course</h3>,
      content: <p>Fill in the course information & assign your students</p>,
      image: '/assets/create-course-dialog.png',
    },
    {
      step: 'Step 2',
      title: <h3 className="font-bold">Upload Your Videos</h3>,
      content: (
        <p className="text-sm md:text-lg">Fill in the video information</p>
      ),
      image: '/assets/create-video-segment.png',
    },
    {
      step: 'Step 3',
      title: <h3 className="font-bold">Finished!</h3>,
      content: (
        <p className="text-sm md:text-lg">
          Its That easy!<span className="font-bold"> Let the course begin.</span>
        </p>
      ),
      image: '/assets/admin-video-view.png',
    },
]