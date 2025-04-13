import { motion } from "motion/react"
import { Accordion, Accordions } from "../ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      title: "How does it work?",
      content: "The student pays for the course fees and opts for the option of Platform me instead of joining in person/zoom lessons, then they will receive a password and email that will be created by the admin to have access to their own account where the course will take place to keep up with it at their own time and paste."
    },
    {
      title: "What are some other features?",
      content: "Some other features include showing analytics of how many students joined the course, and each student has their own details including their status. There is the ability of making the course private for the admins only."
    },
    {
      title: "Are there any hidden costs?", 
      content: "No, there are no hidden costs it is a one time payment, with no monthly ties, and 100% of revenue is yours."
    },
    {
      title: "Do I need technical skills to run the platform?",
      content: "No it's easy going very user friendly, and navigating with ease, by adding, editing deleting courses/ students."
    },
    {
      title: "Can I personalize the platform?",
      content: "Sure, we provide three templates to choose from"
    },
    {
      title: "Do I own my content and can I remove it anytime?",
      content: "Yes the content you upload is fully yours and no one but you has access to it, and you have the ability as as admin to remove it permanently."
    },
    {
      title: "Is there customer support if something goes wrong?",
      content: "Yes, our contractor supports you anytime if something goes wrong"
    },
    {
      title: "Can I use this platform even if I'm already teaching live classes?",
      content: "Of course, this platform is actually an addition to live classes, it is designed to meet the excess demand for teachers who cannot cater their time for extra zoom lessons and overwhelming amour of students"
    },
    {
      title: "How do I upload my course content?",
      content: "You go on the courses tab and press create course, then adding lesson by lesson including description"
    },
    {
      title: "Is there a limit to how many lessons or courses I can upload?",
      content: "No limits upload as many courses or lessons as you like."
    },
    {
      title: "Can I edit or remove my course after it's been published?",
      content: "Yes, editing and removing can both be done even after the course has been published removing the course removes it permanently from the students view"
    },
    {
      title: "Can students leave questions or comments on lessons?",
      content: "Yes they can, this is meant to make it easier for admin(s) to reposed to each student individually and privately."
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
        {/* @ts-ignore */}
        <Accordions className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-x-8 border-0">
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              title={faq.title}
              className="bg-white   border-0 border-b"
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
            className="text-indigo-500 hover:text-indigo-600 font-semibold"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </motion.section>
  )
}
