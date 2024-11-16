import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";
import NavLink from "~/components/nav-link";

export default function Navigation({ user }: { user?: string }) {
  let fetcher = useFetcher();
  let navigate = useNavigate();

  return (
    <nav className="border-b border-gray-100 bg-cornflower-blue-400">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Link to="/">
                <img
                  src="/urios-logo.png"
                  alt=""
                  className="h-9 w-auto drop-shadow-sm"
                />
              </Link>

              <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/shop">Shop</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </div>
            </div>
          </div>

          <div className="hidden gap-x-3 sm:ms-6 sm:flex sm:items-center">
            {user ? (
              <>
                <Link
                  to="/checkout"
                  className="inline-flex gap-x-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
                >
                  <ShoppingCart className="size-4 shrink-0" />
                  My Cart
                </Link>
                <span className="h-4 border-l-2" aria-hidden></span>
                <MenuTrigger>
                  <Button className="inline-flex items-end gap-x-1 text-sm font-medium text-white">
                    {user} <ChevronDown className="size-4 shrink-0" />
                  </Button>
                  <Popover className="entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95 fill-mode-forwards w-56 origin-top-left overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <Menu className="outline-none">
                      <MenuItem
                        onAction={() => navigate("/orders")}
                        className="group box-border flex w-full cursor-default items-center px-3 py-2 text-gray-900 outline-none focus:bg-gray-200"
                      >
                        My Orders
                      </MenuItem>
                      <MenuItem
                        onAction={() =>
                          fetcher.submit("", {
                            method: "post",
                            action: "/logout",
                          })
                        }
                        className="group box-border flex w-full cursor-default items-center px-3 py-2 text-gray-900 outline-none focus:bg-gray-200"
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </Popover>
                </MenuTrigger>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-white transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
                >
                  Login
                </Link>
                <span className="h-4 border-l-2" aria-hidden></span>
                <Link
                  to="/auth/register"
                  className="text-sm font-medium text-white transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
