import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Search } from "lucide-react";
import { requireAuthCookie } from "~/auth/auth";
import SecondaryButton from "~/components/secondary-button";
import AdminLayout from "~/layouts/admin";
import fetchFromStrapi from "~/strapi/fetch-wrapper.server";
import { Product } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Products" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let { jwt } = await requireAuthCookie(request);

  try {
    // Use the fetch wrapper
    const response = await fetchFromStrapi<Product[]>(
      "/api/products?populate=*",
      {
        token: jwt,
      },
    );

    if (response.success) {
      return { products: response.data || [] };
    } else {
      console.error("Error fetching products:", response.error);
      return { products: [] };
    }
  } catch (error) {
    console.error(
      "Unexpected error in loader:",
      error instanceof Error ? error.message : error,
    );
    return { products: [] };
  }
}

export default function AdminProducts() {
  let { products } = useLoaderData<typeof loader>();

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="mx-auto md:px-6 lg:px-8">
          <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
              Products
            </h2>

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="divide-y divide-gray-300">
                  <div className="flex items-center justify-between py-3 ps-1">
                    <div className="relative max-w-xs">
                      <label className="sr-only">Search</label>
                      <input
                        type="text"
                        name="hs-table-with-pagination-search"
                        id="hs-table-with-pagination-search"
                        className="block w-full rounded-lg border-gray-300 px-3 py-2 ps-9 text-sm text-gray-900 shadow-sm focus:z-10 focus:border-cornflower-blue-500 focus:ring-cornflower-blue-500 disabled:pointer-events-none disabled:opacity-50"
                        placeholder="Search for items"
                      />
                      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                        <Search className="size-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <Link
                        to="/admin/export-products"
                        target="_blank"
                        className="btn-secondary"
                      >
                        Export to CSV
                      </Link>
                      <Link
                        to="/admin/products/new"
                        className="btn-primary ms-2"
                      >
                        Add Product
                      </Link>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 pe-0">
                            <div className="flex h-5 items-center">
                              <input
                                id="hs-table-pagination-checkbox-all"
                                type="checkbox"
                                className="rounded border-gray-300 text-cornflower-blue-600 focus:ring-cornflower-blue-500"
                              />
                              <label
                                htmlFor="hs-table-pagination-checkbox-all"
                                className="sr-only"
                              >
                                Checkbox
                              </label>
                            </div>
                          </th>
                          <th scope="col"></th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                          >
                            SKU
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                          >
                            Stock
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                          >
                            Categories
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-end text-xs font-medium uppercase text-gray-500"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="py-3 ps-4">
                              <div className="flex h-5 items-center">
                                <input
                                  id="hs-table-pagination-checkbox-1"
                                  type="checkbox"
                                  className="rounded border-gray-300 text-cornflower-blue-600 focus:ring-cornflower-blue-500"
                                />
                                <label
                                  htmlFor="hs-table-pagination-checkbox-1"
                                  className="sr-only"
                                >
                                  Checkbox
                                </label>
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <img
                                src={`http://localhost:1337${product.images?.[0].url}`}
                                alt={product.name}
                                className="h-10 w-auto object-cover"
                              />
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-start text-sm font-medium text-gray-800">
                              {product.name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-start text-sm text-gray-800">
                              {product.sku}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-end text-sm text-gray-800">
                              {product.price}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                              {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-end text-sm text-gray-800">
                              {product.stock}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                              {product.category?.displayName}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-end text-sm font-medium">
                              <button
                                type="button"
                                className="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-red-600 hover:text-red-800 focus:text-red-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {products.length == 0 && (
                          <tr>
                            <td
                              colSpan={8}
                              className="whitespace-nowrap px-6 py-3 text-center text-sm font-medium text-gray-700"
                            >
                              No data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end px-4 py-1">
                    <nav className="flex items-center" aria-label="Pagination">
                      <button
                        type="button"
                        className="inline-flex min-w-[40px] items-center justify-center gap-x-2 rounded-full p-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">«</span>
                        <span className="sr-only">Previous</span>
                      </button>
                      <button
                        type="button"
                        className="flex min-w-[40px] items-center justify-center rounded-full py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        aria-current="page"
                      >
                        1
                      </button>
                      <button
                        type="button"
                        className="flex min-w-[40px] items-center justify-center rounded-full py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        2
                      </button>
                      <button
                        type="button"
                        className="flex min-w-[40px] items-center justify-center rounded-full py-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        3
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-w-[40px] items-center justify-center gap-x-2 rounded-full p-2.5 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        aria-label="Next"
                      >
                        <span className="sr-only">Next</span>
                        <span aria-hidden="true">»</span>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
