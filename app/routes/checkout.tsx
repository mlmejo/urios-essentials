import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import { getUserCart } from "~/cart/cart";
import PrimaryButton from "~/components/primary-button";
import SecondaryButton from "~/components/secondary-button";
import Navigation from "~/layouts/navigation";
import { Product } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Checkout" }];
};

type EnrichedCartItem = Product & { quantity: number };

export async function action({ request }: ActionFunctionArgs) {
  let { jwt, user } = await requireAuthCookie(request);
  let userCart = await getUserCart(request);

  try {
    let orderResponse = await fetch("http://localhost:1337/api/orders", {
      method: "post",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          user: user.documentId,
        },
      }),
    });

    let order = (await orderResponse.json()).data;

    console.log(order);

    await Promise.all(
      userCart.map((cartItem) => {
        let response = fetch("http://localhost:1337/api/order-items", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              product: cartItem.productId,
              quantity: cartItem.quantity,
              order: order.documentId,
            },
          }),
        });

        return response;
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Checkout action failed: ", error.message);
    }
  }

  return redirect("/shop");
}

export async function loader({ request }: LoaderFunctionArgs) {
  let { user } = await requireAuthCookie(request);
  let userCart = await getUserCart(request);

  try {
    let response = await fetch("http://localhost:1337/api/products?populate=*");
    let products = (await response.json()).data as Product[];

    let enrinchedCart = userCart.map((cartItem) => {
      let product = products.find(
        (product) => product.documentId === cartItem.productId,
      );

      if (product) {
        return {
          ...cartItem,
          ...product,
        };
      }

      return cartItem;
    });

    return { user: user.email, userCart: enrinchedCart };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }

  return { user: user.email, userCart: [] };
}

export default function CheckOut() {
  let { user, userCart } = useLoaderData<typeof loader>();
  let subtotal = userCart.reduce((total, cartItem: any) => {
    let itemSubtotal = cartItem.quantity * cartItem.price;
    return total + itemSubtotal;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />

      <div className="mx-auto py-12 md:px-6 lg:px-8">
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Order Details
        </h2>

        {userCart.length === 0 && (
          <p className="mt-4 text-xl font-bold leading-tight text-gray-800">
            You haven't made any orders yet!
          </p>
        )}

        <div className="mt-6 flex items-start gap-6">
          <div className="flex basis-2/3 flex-col gap-y-6">
            {userCart.map((cartItem: any, index) => (
              <div
                key={index}
                className="flex flex-1 items-center justify-between bg-white p-6 shadow-sm sm:rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={`http://localhost:1337${cartItem.images?.[0].url}`}
                    alt={cartItem.name}
                    className="h-24 w-auto"
                  />
                  <h2 className="ms-6 font-semibold text-gray-800">
                    {cartItem.name}
                  </h2>
                </div>
                <div className="flex items-center font-medium text-gray-800">
                  Quantity: {cartItem.quantity}
                  <SecondaryButton className="ms-2 rounded-full px-3 py-1.5">
                    X
                  </SecondaryButton>
                </div>
              </div>
            ))}
          </div>

          {userCart.length > 0 && (
            <div className="flex-1 bg-white p-6 shadow-sm sm:rounded-lg">
              <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Order Summary
              </h2>
              <div className="mt-2 flex items-center justify-between pb-2">
                <p className="font-medium text-gray-700">Subtotal</p>
                <p className="font-semibold text-gray-800">PHP {subtotal}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-300 pt-2">
                <p className="font-medium text-gray-700">Total</p>
                <p className="font-semibold text-gray-800">PHP {subtotal}</p>
              </div>

              <Form method="post">
                <PrimaryButton className="mt-6 w-full justify-center py-3 text-base">
                  Checkout
                </PrimaryButton>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
