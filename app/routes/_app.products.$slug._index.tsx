import { ToastContainer, ToastQueue } from "@react-spectrum/toast";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import InputLabel from "~/components/input-label";
import UserReviews from "~/components/user-reviews";
import { getProductBySlug } from "~/products/queries";

export const meta: MetaFunction = () => {
  return [{ title: "Product Details" }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    let product = await getProductBySlug(params.slug!);
    return { product };
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
  let { product } = useLoaderData<typeof loader>();
  let [quantity, setQuantity] = useState(0);
  let fetcher = useFetcher();

  function decrement() {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  }

  function increment(value: number) {
    if (quantity + value > product.stock) return;
    setQuantity(quantity + value);
  }

  useEffect(() => {
    if (quantity > product.stock) {
      setQuantity(product.stock);
    }
  }, [quantity]);

  return (
    <>
      <ToastContainer />
      <div className="py-12">
        <div className="mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-x-12">
            <img
              src={`http://localhost:1337${product.images?.[0].url}`}
              alt={product.name}
              className="h-56 rounded-md"
            />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div>
                    <h2 className="mr-4 text-2xl font-semibold leading-tight text-gray-800">
                      {product.name}
                    </h2>
                    <p className="text-lg font-medium text-gray-800">
                      PHP {product.price}
                    </p>
                  </div>
                  <span className="inline-block rounded-full bg-green-500 px-2 py-1 text-sm font-medium text-white">
                    {product.stock} in Stock
                  </span>
                </div>
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
                        onClick={() => increment(1)}
                      >
                        <Plus className="size-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  onPress={() => {
                    if (quantity > 0) {
                      fetcher.submit(
                        {
                          quantity: quantity,
                          productId: product.documentId!,
                          intent: "INCREMENT",
                        },
                        { method: "post", action: "/cart" },
                      );

                      if (fetcher.data) {
                        ToastQueue.positive("Added to cart!", {
                          timeout: 1000,
                        });
                      }
                      return;
                    }

                    ToastQueue.negative(
                      "Please add at least one item to your cart to proceed with your order.",
                    );
                  }}
                  className="btn-primary mt-4 w-full justify-center"
                >
                  Add to Cart
                </Button>
              </Form>
            </div>
            <UserReviews reviews={mockReviews} />
          </div>
        </div>
      </div>
    </>
  );
}

const mockReviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    reviewText: "Amazing product! Highly recommend it.",
    date: "2024-11-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    reviewText: "Great quality, but delivery took a bit longer than expected.",
    date: "2024-10-30",
  },
  {
    id: 3,
    name: "Bob Johnson",
    rating: 3,
    reviewText: "It's okay, but I've seen better for this price range.",
    date: "2024-10-28",
  },
];
