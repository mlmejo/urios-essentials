import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import AdminLayout from "~/layouts/admin";
import { OrderItem } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Orders" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let { jwt } = await requireAuthCookie(request);

  try {
    let response = await fetch(
      "http://localhost:1337/api/order-items?populate[product][populate][0]=images",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    let result = (await response.json()).data;
    return { orderItems: result } as { orderItems: OrderItem[] };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Orders loader failed: ", error.message);
    }
  }

  return { orderItems: [] };
}

export default function Orders() {
  let { orderItems } = useLoaderData<typeof loader>();

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="md:px6 mx-auto lg:px-8">
          <div className="bg-white p-6 shadow-sm sm:rounded-lg">
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
                      Order
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      ID Number
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      Total Quantity
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
                  {orderItems?.map((orderItem) => (
                    <tr key={orderItem.documentId}>
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
                          src={`http://localhost:1337${orderItem.product.images?.[0].url}`}
                          alt={orderItem.product.name}
                          className="h-10 w-auto object-cover"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-start text-sm font-medium text-gray-800">
                        {orderItem.product.name}
                      </td>
                      <td className="max-w-[12ch] truncate whitespace-nowrap px-4 py-3 text-start text-sm text-gray-800">
                        {orderItem.documentId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-start text-sm text-gray-800">
                        {new Date(orderItem.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-start text-sm text-gray-800">
                        {orderItem.status || "Processing"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-end text-sm text-gray-800">
                        PHP {orderItem.product.price * orderItem.quantity}
                        <p>Quantity {orderItem.quantity}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-end text-sm font-medium"></td>
                    </tr>
                  ))}
                  {orderItems?.length == 0 && (
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
