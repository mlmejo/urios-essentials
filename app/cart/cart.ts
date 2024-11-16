import { createCookie } from "@remix-run/node";
import { Cart, CartItem } from "~/types";
import { CartDispatchAction } from "./types";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
  );
  secret = "default-secret";
}

let cookie = createCookie("cart", {
  secrets: [secret],
  // 30 days
  maxAge: 30 * 24 * 60 * 60,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export async function getUserCart(request: Request): Promise<Cart> {
  let userCart = await cookie.parse(request.headers.get("Cookie"));
  return userCart ?? [];
}

export async function dispatchCart(
  request: Request,
  selectedItem: CartItem,
  action: CartDispatchAction,
) {
  let cart = await getUserCart(request);
  let existingCartItem = cart.find(
    (cartItem) => cartItem.productId === selectedItem.productId,
  );

  switch (action) {
    case "INCREMENT":
      if (existingCartItem) {
        existingCartItem.quantity += selectedItem.quantity;
      } else {
        cart.push(selectedItem);
      }
      break;
    case "DECREMENT":
      if (existingCartItem) {
        let result = existingCartItem.quantity - selectedItem.quantity;
        if (result >= 0) {
          existingCartItem.quantity = result;
        }
      }
      break;
    case "REMOVE":
      if (existingCartItem) {
        cart = cart.filter(
          (cartItem) => cartItem.productId !== selectedItem.productId,
        );
      }
      break;
  }

  return cart;
}

export async function setCartOnResponse(response: Response, cart: Cart) {
  let header = await cookie.serialize(cart);
  response.headers.append("Set-Cookie", header);
  return response;
}
