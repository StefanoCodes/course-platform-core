import { Link } from "react-router";
import { authNavItems, mainNavItems } from "~/config/navigation";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <div className="w-full sticky top-0 z-40 h-[var(--navbar-height)]  border-b border-gray-300 text-black backdrop-blur-xl">
      <header className=" px-6 lg:px-0 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

            <img src="/assets/LOGO.png" width={32} height={32}/>
            <p className="font-bold text-lg md:text-xl">PLATFORM 4ME</p>
          </div>
     
          <div className="flex items-center">
            <nav className="hidden space-x-8 md:flex">
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
          <div className="flex items-center space-x-4 md:min-w-[234px]">
            {authNavItems.map((item) => (
              <Button
                key={item.href}
                variant="outline"
                className="cursor-pointer inset-ring-2 inset-ring-indigo-300 bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white"
                asChild
                >
              <Link to={item.href} key={item.href}>
                {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </header>
    </div>
  )
}