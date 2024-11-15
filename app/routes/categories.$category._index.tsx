import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import Navigation from "~/layouts/navigation";
import { getProductsByCategory } from "~/products/queries";
import { Product } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Products by Category" }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  let { user } = await requireAuthCookie(request);

  try {
    let category = params.category;
    if (!category) {
      category = "books";
    }
    return {
      products: await getProductsByCategory(category),
      user: user.email,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("ProductByCategory loader: ", error.message);
    }
  }

  return { products: [], user: user.email } as {
    products: Product[];
    user: string;
  };
}

export default function ProductByCategory() {
  let { products, user } = useLoaderData<typeof loader>();
  let categoryName =
    products.length > 0 ? products[0].category?.displayName : "";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />

      <div className="py-6">
        <div className="mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray-800">
            {categoryName || "No products available"}
          </h2>

          <div className="mt-6 grid grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/products/${product.slug}`}
                className="flex flex-col rounded-md bg-gray-200 p-4"
              >
                <div className="flex-1">
                  <img
                    src={`http://localhost:1337${product.images?.[0].url}`}
                    alt={product.name}
                  />
                </div>
                <p className="text-center text-xl font-semibold text-gray-800">
                  {product.name}
                </p>
                <div className="mt-4 flex justify-between font-medium text-gray-900">
                  <p>{product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}</p>
                  <p>PHP {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
