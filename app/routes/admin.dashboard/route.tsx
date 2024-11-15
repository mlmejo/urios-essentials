import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import AdminLayout from "~/layouts/admin";
import { OrderItem } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Admin Dashboard" }];
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

export default function AdminDashboard() {
  let { orderItems } = useLoaderData<typeof loader>();
  let totalSales = orderItems.reduce((total, orderItem) => {
    let itemSubtotal = orderItem.quantity * orderItem.product.price;
    return total + itemSubtotal;
  }, 0);

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow-sm sm:rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                  Total Sales
                </h2>
                <p className="text-sm font-medium text-gray-800">
                  PHP ${totalSales}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
