import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { setAuthOnResponse } from "~/auth/auth";
import { register } from "~/auth/queries";
import InputLabel from "~/components/input-label";
import PrimaryButton from "~/components/primary-button";
import TextInput from "~/components/text-input";

export const meta: MetaFunction = () => {
  return [{ title: "Register Login" }];
};

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let data = Object.fromEntries(formData);

  if (data.password !== data.password_confirmation) {
    return { authError: "Passwords do not match" };
  }

  try {
    let userData = await register(
      String(data.identifier),
      String(data.password),
    );
    let response = redirect("/shop");
    return await setAuthOnResponse(response, userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in Register action: ", error.message);
      return { authError: error.message };
    }
  }

  return null;
}

export default function Register() {
  let actionData = useActionData<{ authError?: string } | null>();

  return (
    <div className="min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-12">
      <div className="flex items-center">
        <img
          src="/urios-logo.png"
          alt="Father Saturnino Urios Univeristy Logo"
          className="h-40 w-auto drop-shadow-md"
        />
      </div>

      <div className="mt-6 w-full bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
        <h2 className="text-center text-xl font-semibold leading-tight text-gray-800">
          Login
        </h2>
        <Form method="post">
          <div className="mt-4">
            <InputLabel htmlFor="identifier">Email address</InputLabel>
            <TextInput
              type="email"
              name="identifier"
              id="identifier"
              className="mt-1 block w-full"
              required
              autoComplete="name"
              autoFocus
            />
          </div>
          <div className="mt-4">
            <InputLabel htmlFor="password">Password</InputLabel>
            <TextInput
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full"
              required
              autoComplete="current-password"
            />
          </div>
          <div className="mt-4">
            <InputLabel htmlFor="password_confirmation">
              Confrm Password
            </InputLabel>
            <TextInput
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              className="mt-1 block w-full"
              required
              autoComplete="current-password"
            />
          </div>
          <div className="mt-4">
            <PrimaryButton className="w-full justify-center">
              Register
            </PrimaryButton>
          </div>
        </Form>
      </div>
    </div>
  );
}
