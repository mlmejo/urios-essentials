import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import fetchFromStrapi from "~/strapi/fetch-wrapper.server";
import { OrderItem } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  let { user } = await requireAuthCookie(request);
  let response = await fetchFromStrapi<OrderItem[]>(
    `/api/order-items?filters[order][user][documentId][$eq]=${user.documentId}&populate=product.images`,
  );

  if (response.success && response.data) {
    return { userOrders: response.data };
  }

  return { userOrders: [] };
}

export default function OrderStatus() {
  let { userOrders } = useLoaderData<typeof loader>();
  let randomTuition = Math.floor(Math.random() * (22000 - 19000 + 1)) + 19000;
  let totalExpenses = userOrders.reduce((total, orderItem: OrderItem) => {
    let itemSubtotal = orderItem.quantity * orderItem.product.price;
    return total + itemSubtotal;
  }, 0);

  function renderStatus(orderStatus: string) {
    switch (orderStatus) {
      case "Processing":
        return <span className="text-orange-500">Processing</span>;
      case "Cancelled":
        return <span className="text-red-500">Cancelled</span>;
      case "Completed":
        return <span className="text-green-500">Completed</span>;
    }
  }

  return (
    <div className="py-12">
      <div className="mx-auto md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
              Order Details
            </h2>
            <div className="mt-6 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col"></th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      Order
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      ID Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-start text-xs font-medium uppercase text-gray-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-end text-xs font-medium uppercase text-gray-500"
                    >
                      Total Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {userOrders?.map((orderItem) => (
                    <tr key={orderItem.documentId}>
                      <td className="px-6 py-3">
                        <img
                          src={`http://localhost:1337${orderItem.product.images?.[0].url}`}
                          alt={orderItem.product.name}
                          className="h-10 w-auto object-cover"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-start text-sm font-medium text-gray-800">
                        {orderItem.product.name}
                      </td>
                      <td className="max-w-[12ch] truncate whitespace-nowrap px-3 py-3 text-start text-sm text-gray-800">
                        {orderItem.documentId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-start text-sm text-gray-800">
                        {new Date(orderItem.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-start text-sm text-gray-800">
                        {renderStatus(orderItem.orderStatus)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-end text-sm text-gray-800">
                        PHP {orderItem.product.price * orderItem.quantity}
                        <p>Quantity {orderItem.quantity}</p>
                      </td>
                    </tr>
                  ))}
                  {userOrders?.length == 0 && (
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
          <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
              Student Assessment
            </h2>

            <table className="w-full mt-6">
              <thead>
                <tr>
                  <th className="text-start">Description</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-start">Tuition</td>
                  <td className="text-end">
                    PHP {randomTuition.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="text-start">Miscalleanous</td>
                  <td className="text-end">
                    PHP {totalExpenses.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="text-start">Total Assessment</td>
                  <td className="text-end">
                    PHP {(totalExpenses + randomTuition).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
