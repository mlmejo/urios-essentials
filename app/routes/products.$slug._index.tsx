import { defaultTheme, Provider } from "@adobe/react-spectrum";
import { ToastContainer, ToastQueue } from "@react-spectrum/toast";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "react-aria-components";
import { requireAuthCookie } from "~/auth/auth";
import { dispatchCart, setCartOnResponse } from "~/cart/cart";
import InputLabel from "~/components/input-label";
import Navigation from "~/layouts/navigation";
import { getProductBySlug } from "~/products/queries";

export const meta: MetaFunction = () => {
  return [{ title: "Product Details" }];
};

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  let cart = await dispatchCart(
    request,
    {
      productId: String(formData.get("productId")),
      quantity: +String(formData.get("quantity")),
    },
    "add",
  );

  let response = redirect(request.url);
  return setCartOnResponse(response, cart);
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  let { user } = await requireAuthCookie(request);

  try {
    let product = await getProductBySlug(params.slug!);
    return { product, user: user.email };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in Product loader", error.message);
    }
  }

  throw new Response(null, {
    status: 404,
    statusText: "Product not found",
  });
}

export default function Product() {
  let { product, user } = useLoaderData<typeof loader>();
  let [quantity, setQuantity] = useState(0);
  let fetcher = useFetcher();

  function decrement() {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <Provider theme={defaultTheme}>
      <div className="min-h-screen bg-gray-100">
        <Navigation user={user} />
        <ToastContainer />
        <div className="py-12">
          <div className="mx-auto px-4 py-12 md:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-x-12">
              <img
                src={`http://localhost:1337${product.images?.[0].url}`}
                alt={product.name}
                className="h-56 rounded-md"
              />
              <div>
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text font-medium text-gray-800">
                    PHP {product.price}
                  </p>
                </div>
                <Form method="post" className="mt-6">
                  <input
                    type="hidden"
                    name="productId"
                    value={product.documentId}
                  />
                  <InputLabel htmlFor="quantity">Quantity</InputLabel>
                  <div className="mt-1 rounded-md border border-gray-300 bg-white">
                    <div className="flex w-full items-center justify-between gap-x-1">
                      <div className="grow px-3 py-2">
                        <input
                          id="quantity"
                          name="quantity"
                          className="w-full border-0 bg-transparent p-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          style={{ MozAppearance: "textfield" }}
                          type="number"
                          aria-roledescription="Number field"
                          value={quantity}
                          onChange={(e) => setQuantity(+e.target.value)}
                        />
                      </div>
                      <div className="-gap-y-px flex items-center divide-x divide-gray-200 border-s border-gray-200">
                        <button
                          type="button"
                          className="inline-flex size-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                          aria-label="Decrease"
                          onClick={decrement}
                        >
                          <Minus className="size-3.5 shrink-0" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex size-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                          aria-label="Increase"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="size-3.5 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button
                    onPress={() => {
                      ToastQueue.positive("Added to cart!", { timeout: 1000 });
                      fetcher.submit(
                        { quantity: quantity, productId: product.documentId! },
                        { method: "post" },
                      );
                    }}
                    className="btn-primary mt-4 w-full justify-center"
                  >
                    Add to Cart
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
}
