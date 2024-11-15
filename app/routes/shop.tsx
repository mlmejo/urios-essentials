import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import Navigation from "~/layouts/navigation";

export async function loader({ request }: LoaderFunctionArgs) {
  let { user } = await requireAuthCookie(request);
  return { user: user.email };
}

export default function Shop() {
  let { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />

      <div className="py-12">
        <div className="mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-center text-xl font-semibold leading-tight text-gray-800">
            Product Categories
          </h2>

          <div className="mt-6 flex justify-center gap-x-6">
            <Link
              to="/categories/school-supplies"
              className="flex w-full rounded-md bg-blue-400/20 p-6 shadow-md"
            >
              <h3 className="text-3xl font-bold text-blue-600">
                School Supplies
              </h3>
            </Link>

            <Link
              to="/categories/uniforms"
              className="flex w-full rounded-md bg-green-400/20 p-6 shadow-md"
            >
              <h3 className="text-3xl font-bold text-green-600">
                School Uniform
              </h3>
            </Link>

            <Link
              to="/categories/books"
              className="flex w-full rounded-md bg-yellow-400/20 p-6 shadow-md"
            >
              <h3 className="text-3xl font-bold text-yellow-600">Books</h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
