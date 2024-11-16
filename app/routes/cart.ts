import { ClientActionFunctionArgs, redirect } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import { dispatchCart, setCartOnResponse } from "~/cart/cart";
import { CartDispatchAction } from "~/cart/types";

export async function action({ request }: ClientActionFunctionArgs) {
  await requireAuthCookie(request);
  let formData = await request.formData();

  let cart = await dispatchCart(
    request,
    {
      productId: String(formData.get("productId")),
      quantity: +String(formData.get("quantity")),
    },
    String(formData.get("intent")) as CartDispatchAction,
  );

  let response = redirect(request.headers.get("Referer") || "/checkout");
  return setCartOnResponse(response, cart);
}
