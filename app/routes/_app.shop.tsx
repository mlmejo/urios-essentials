import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Shop" }];
};

export default function Shop() {
  return (
    <div className="py-12">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-center text-xl font-semibold leading-tight text-gray-800">
          Product Categories
        </h2>

        <div className="mt-6 flex justify-center gap-x-6">
          <Link
            to="/categories/school-supplies"
            className="flex w-full flex-col items-center rounded-md bg-blue-400/20 p-6 shadow-md"
          >
            <h3 className="text-3xl font-bold text-blue-600">
              School Supplies
            </h3>
            <img
              src="/school-supplies.png"
              alt="School Supplies"
              className="h-full object-cover"
            />
          </Link>

          <Link
            to="/categories/uniforms"
            className="flex w-full flex-col items-center rounded-md bg-green-400/20 p-6 shadow-md"
          >
            <h3 className="text-3xl font-bold text-green-600">
              School Uniform
            </h3>
            <img
              src="/uniforms.png"
              alt="Uniforms"
              className="h-full object-contain"
            />
          </Link>

          <Link
            to="/categories/books"
            className="flex w-full flex-col items-center rounded-md bg-yellow-400/20 p-6 shadow-md"
          >
            <h3 className="text-3xl font-bold text-yellow-600">Books</h3>
            <img src="/books.png" alt="Books" className="h-full object-cover" />
          </Link>
        </div>
      </div>
    </div>
  );
}
