import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { requireAuthCookie } from "~/auth/auth";
import PrimaryButton from "~/components/primary-button";
import SelectInput from "~/components/select-input";
import AdminLayout from "~/layouts/admin";
import fetchFromStrapi from "~/strapi/fetch-wrapper.server";
import { OrderItem } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Orders" }];
};

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let { jwt } = await requireAuthCookie(request);
  let orderStatus = formData.get("orderStatus");

  let orderItemIds = JSON.parse(
    String(formData.get("orderItemIds")),
  ) as string[];

  try {
    // Fetch and update each order item
    const statusUpdates = orderItemIds.map(async (orderItemId) => {
      // Define the payload with existing data and updated status
      const updatedData = {
        data: {
          orderStatus: orderStatus,
        },
      };

      // Send the updated data to Strapi
      const updateResponse = await fetchFromStrapi(
        `/api/order-items/${orderItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (!updateResponse.success) {
        throw new Error(
          updateResponse.error || "Failed to update order item status",
        );
      }
    });

    await Promise.all(statusUpdates);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating order items:", error.message);
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  let { jwt } = await requireAuthCookie(request);
  let query = new URL(request.url).searchParams.get("query") ?? "";

  try {
    let response = await fetch(
      `http://localhost:1337/api/order-items?filters[documentId][$contains]=${query}&populate[product][populate][0]=images`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    let result = (await response.json()).data;
    return { orderItems: result, query } as {
      orderItems: OrderItem[];
      query: string;
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Orders loader failed: ", error.message);
    }
  }

  return { orderItems: [], query };
}

export default function Orders() {
  let { orderItems, query } = useLoaderData<typeof loader>();
  let fetcher = useFetcher();

  useEffect(() => {
    let searchField = document.getElementById("query");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = query;
    }
  }, [query]);

  function toggleMarkAll() {
    let checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#toggle-select-all)',
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;
    });
  }

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

  async function changeOrderStatus() {
    let selectedOrderItems = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:checked:not(#toggle-select-all)',
    );

    let orderItemIds = Array.from(selectedOrderItems).map((item) => item.value);
    let orderStatus = document.getElementById("order-status-select");

    if (orderStatus instanceof HTMLSelectElement) {
      fetcher.submit(
        {
          orderItemIds: JSON.stringify(orderItemIds),
          orderStatus: orderStatus!.value,
          intent: "CHANGE_ORDER_STATUS",
        },
        { method: "post", action: "" },
      );
    }
  }

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="md:px6 mx-auto lg:px-8">
          <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Orders
              </h2>

              <div className="flex items-center">
                <SelectInput
                  id="order-status-select"
                  aria-label="Change Order Status"
                  className="block text-sm font-medium"
                >
                  <option value="">Change Order Status</option>
                  <option value="Processing">Status to Processing</option>
                  <option value="Cancelled">Status to Cancelled</option>
                  <option value="Completed">Status to Completed</option>
                </SelectInput>
                <PrimaryButton onClick={changeOrderStatus} className="ms-2">
                  Apply
                </PrimaryButton>
              </div>
            </div>
            <Form role="search" className="mt-2">
              <div className="relative">
                <input
                  type="text"
                  name="query"
                  className="peer block rounded-md border-gray-300 ps-11 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                  placeholder="Search ID Number"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 peer-disabled:pointer-events-none peer-disabled:opacity-50">
                  <Search className="size-4 shrink-0 text-gray-500" />
                </div>
              </div>
            </Form>

            <div className="mt-6 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 pe-0">
                      <div className="flex h-5 items-center">
                        <input
                          id="toggle-select-all"
                          type="checkbox"
                          onClick={toggleMarkAll}
                          className="rounded border-gray-300 text-cornflower-blue-600 focus:ring-cornflower-blue-500"
                        />
                        <label htmlFor="toggle-select-all" className="sr-only">
                          Checkbox
                        </label>
                      </div>
                    </th>
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
                  {orderItems?.map((orderItem) => (
                    <tr key={orderItem.documentId}>
                      <td className="py-3 ps-4">
                        <div className="flex h-5 items-center">
                          <input
                            id={`order-${orderItem.documentId}`}
                            type="checkbox"
                            value={orderItem.documentId}
                            className="rounded border-gray-300 text-cornflower-blue-600 focus:ring-cornflower-blue-500"
                          />
                          <label
                            htmlFor={`order-${orderItem.documentId}`}
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
