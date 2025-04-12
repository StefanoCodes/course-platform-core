import { Link } from "react-router"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Button } from "../ui/button"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              {/* <img
                className="h-10 w-auto"
                src="/images/logo.png"
                alt="Company Logo"
              /> */}
              <span className="text-xl font-bold text-gray-900">EduPlatform</span>
            </Link>
            <p className="text-base text-gray-600">
              Transform your teaching journey with our innovative online course platform.
              Reach students globally and make an impact.
            </p>
            <div className="flex space-x-6">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link to="/features" className="text-base text-gray-600 hover:text-gray-900">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-base text-gray-600 hover:text-gray-900">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="text-base text-gray-600 hover:text-gray-900">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link to="/testimonials" className="text-base text-gray-600 hover:text-gray-900">
                      Testimonials
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link to="/blog" className="text-base text-gray-600 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/guides" className="text-base text-gray-600 hover:text-gray-900">
                      Teaching Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/documentation" className="text-base text-gray-600 hover:text-gray-900">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link to="/support" className="text-base text-gray-600 hover:text-gray-900">
                      Support Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link to="/about" className="text-base text-gray-600 hover:text-gray-900">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="text-base text-gray-600 hover:text-gray-900">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-base text-gray-600 hover:text-gray-900">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/partners" className="text-base text-gray-600 hover:text-gray-900">
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link to="/privacy" className="text-base text-gray-600 hover:text-gray-900">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-base text-gray-600 hover:text-gray-900">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/cookies" className="text-base text-gray-600 hover:text-gray-900">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 xl:text-center">
            &copy; {new Date().getFullYear()} EduPlatform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
