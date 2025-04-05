import { Link } from "react-router";
import { authNavItems, mainNavItems } from "~/config/navigation";
import { Button } from "../ui/button";

export default function Navbar() {
    return (
      <div className="w-full sticky top-0 z-10 h-[var(--navbar-height)]  bg-white/10 backdrop-blur-lg">
        <header className=" px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold">
              Logo
            </Link>
          <div className="flex items-center">
         
            <nav className="hidden ml-12 space-x-8 md:flex">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
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
                variant="secondary"
                className="cursor-pointer"
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