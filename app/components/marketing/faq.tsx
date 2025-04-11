import { motion } from "motion/react"
import { Accordion, Accordions } from "../ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      title: "How do I get started as a teacher?",
      content: "Getting started is easy! Simply sign up for a teacher account, verify your credentials, and you can begin creating your first course. We provide comprehensive tools and guides to help you structure your content, set up assessments, and engage with students effectively."
    },
    {
      title: "What types of courses can I create?",
      content: "You can create courses in virtually any subject area. Whether you're teaching academic subjects, professional skills, creative arts, or personal development, our platform supports various content types including video lectures, interactive assignments, quizzes, and downloadable resources."
    },
    {
      title: "How does the payment system work?",
      content: "We handle all payment processing securely. You set your course pricing, and when students enroll, we process the payment and transfer your earnings to your account. We offer flexible payout options and transparent revenue sharing, with teachers typically receiving 70-80% of course sales."
    },
    {
      title: "Can I interact with my students?",
      content: "Yes! Our platform offers multiple ways to engage with your students. You can participate in course discussions, host live sessions, provide direct feedback on assignments, and send announcements to your class. We believe in fostering an interactive learning environment."
    },
    {
      title: "What support do you offer to teachers?",
      content: "We provide comprehensive support including technical assistance, course creation guidelines, marketing tips, and access to our teacher community. Our dedicated support team is available to help you with any questions or issues you encounter."
    },
    {
      title: "How do I track my course's performance?",
      content: "Our analytics dashboard provides detailed insights into your course performance, including student enrollment numbers, completion rates, revenue statistics, and student feedback. This data helps you understand your impact and optimize your teaching approach."
    }
  ]

  return (
    <motion.section
      id="faq"
      className="py-16 px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about teaching and creating courses on our platform.
          </p>
        </div>

        {/* FAQ Accordions */}
        <Accordions className="max-w-3xl mx-auto flex flex-col gap-4 border-0">
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              title={faq.title}
              className="bg-white rounded-lg  border-0 border-b"
            >
              <p>{faq.content}</p>
            </Accordion>
          ))}
        </Accordions>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="text-brand-primary hover:text-brand-primary/90 font-semibold"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </motion.section>
  )
}
