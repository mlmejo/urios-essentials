import { Form, Link, LinkProps, NavLink } from "@remix-run/react";
import { Archive, LayoutDashboard, LogOut, ShoppingCart } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function Sidebar() {
  return (
    <div className="hidden min-h-screen w-64 shrink-0 bg-cornflower-blue-500 md:block">
      <div className="py-8">
        <div className="flex flex-col items-center">
          <header>
            <Link to="/admin" className="flex items-center gap-x-2">
              <img
                src="/urios-logo.png"
                className="h-16 w-auto drop-shadow-md"
              />
              <h2 className="text-xl font-semibold leading-tight text-white">
                Admin
              </h2>
            </Link>
          </header>

          <nav className="mt-8 flex w-full flex-col space-y-4 px-6">
            <SidebarLink to="/admin/dashboard">
              <LayoutDashboard className="size-4 shrink-0" />
              Dashboard
            </SidebarLink>

            <SidebarLink to="/admin/products">
              <Archive className="size-4 shrink-0" />
              Products
            </SidebarLink>

            <SidebarLink to="/admin/orders">
              <ShoppingCart className="size-4 shrink-0" />
              Orders
            </SidebarLink>

            <Form method="post" action="/logout">
              <button className="flex w-full items-center gap-x-2 rounded-md px-4 py-2 ps-11 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cornflower-blue-500">
                <LogOut className="size-4 shrink-0" />
                Log out
              </button>
            </Form>
          </nav>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, children, ...props }: LinkProps) {
  return (
    <NavLink
      {...props}
      to={to}
      className={({ isActive }) =>
        twMerge(
          "inline-flex items-center gap-x-2 rounded-md px-4 py-2 ps-11 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cornflower-blue-500",
          isActive && "bg-gray-50 text-gray-800",
          !isActive && "text-white hover:bg-gray-50 hover:text-gray-800",
        )
      }
    >
      {children}
    </NavLink>
  );
}
