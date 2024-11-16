import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import ProductCarousel from "~/components/product-carousel/product-carousel";
import fetchFromStrapi from "~/strapi/fetch-wrapper.server";
import { Product } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "FSUU Online Book Store" }];
};

export async function loader() {
  try {
    let response = await fetchFromStrapi<Product[]>("/api/products?populate=*");

    if (response.success && response.data) {
      return { products: response.data };
    }

    console.error("Error fetching products:", response.error);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in Index loader:", error.message);
    }
  }

  return { products: undefined };
}

export default function Index() {
  let { products } = useLoaderData<typeof loader>();

  return (
    <div className="py-8">
      <div className="mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-start">
          <div>
            <header className="max-w-xl">
              <h2 className="text-6xl font-semibold leading-none">
                FSUU ONLINE BOOK STORE
              </h2>
              <blockquote className="mt-2 font-medium">
                &quot;Why wait in line? Get Your School Gear Online!&quot; -
                Fast, Easy, and Convenient
              </blockquote>
            </header>
            <section role="region" className="mt-4">
              <h3 className="font-medium">Best Selling Books</h3>
              <div className="flex items-center gap-x-3">
                {products
                  ?.filter((product) =>
                    product.category ? product.category.name == "books" : false,
                  )
                  .slice(0, 3)
                  .map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="flex-1 basis-1/3 transition duration-150 ease-in-out hover:scale-105"
                    >
                      <img
                        src={`http://localhost:1337${product.images?.[0].url}`}
                        alt={product.name}
                        className="mx-auto h-48 rounded-md shadow-sm"
                      />
                      <div className="mt-2 text-center text-sm font-medium">
                        <p>{product.name}</p>
                        <p className="text-gray-600">PHP {product.price}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          </div>
          <div className="mx-auto flex flex-col items-center">
            <ProductCarousel products={products} />
            <Link
              to="/shop"
              className="mt-4 bg-cornflower-blue-500 px-5 py-4 text-white transition duration-150 ease-in-out hover:bg-cornflower-blue-600"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
