import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import { getUserCart } from "~/cart/cart";
import Navigation from "~/layouts/navigation";
import { Product } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  let { jwt } = await requireAuthCookie(request);
  let userCart = await getUserCart(request);

  let response = await fetch("http://localhost:1337/api/products?populate=*", {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  let products = (await response.json()).data as Product[];
  let enrinchedCart = userCart.map((cartItem) => {
    let product = products.find(
      (product) => String(product.id!) === cartItem.productId,
    );

    if (product) {
      return {
        ...cartItem,
        ...product,
      };
    }

    return cartItem;
  });

  return { userCart: enrinchedCart };
}

export default function CheckOut() {
  let { userCart } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
    </div>
  );
}
