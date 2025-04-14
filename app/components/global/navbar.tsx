import { Link } from "react-router";
import { authNavItems, mainNavItems } from "~/config/navigation";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <div className="w-full sticky top-0 z-40 h-[var(--navbar-height)]  border-b border-gray-300 text-black backdrop-blur-xl">
      <header className=" px-6 lg:px-0 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-indigo-500 text-2xl font-bold">
            PLAT4ME
          </Link>
          <div className="flex items-center">
            <nav className="hidden ml-12 space-x-8 md:flex">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="transition-colors hover:text-indigo-500"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {authNavItems.map((item) => (
              <Button
                key={item.href}
                variant="outline"
                className="cursor-pointer inset-ring-2 inset-ring-indigo-300 bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </header>
    </div>
  )
}