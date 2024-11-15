import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAuthFromRequest } from "~/auth/auth";
import ProductCarousel from "~/components/product-carousel/product-carousel";
import Navigation from "~/layouts/navigation";
import { CarouselItem, Product } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "FSUU Online Book Store" }];
};

export async function loader({ request }: ActionFunctionArgs) {
  let userData = await getAuthFromRequest(request);

  try {
    let response = await fetch("http://localhost:1337/api/products?populate=*");
    let products = (await response.json()).data as Product[];
    let carouselItems: CarouselItem[] = [];

    products.forEach((product) => {
      product.images?.forEach((image) =>
        carouselItems.push({
          url: `http://localhost:1337${image.url}`,
          category: product.category?.name!,
        }),
      );
    });

    return { products, carouselItems, user: userData?.user.email };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in Index loader:", error.message);
    }
  }

  return { products: [], carouselItems: [], user: userData?.user.email } as {
    products: Product[];
    carouselItems: CarouselItem[];
    user?: string;
  };
}

export default function Index() {
  let { products, carouselItems, user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navigation user={user} />

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
                      product.category
                        ? product.category.name == "books"
                        : false,
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
              <ProductCarousel carouselItems={carouselItems} />
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
    </div>
  );
}
