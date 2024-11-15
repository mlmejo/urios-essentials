import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { setAuthOnResponse } from "~/auth/auth";
import InputError from "~/components/input-error";
import InputLabel from "~/components/input-label";
import PrimaryButton from "~/components/primary-button";
import TextInput from "~/components/text-input";
import { login } from "../../auth/queries";

export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let data = Object.fromEntries(formData);

  try {
    let userData = await login(String(data.identifier), String(data.password));
    let response = redirect("/admin/dashboard");
    return await setAuthOnResponse(response, userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in AdminLogin action: ", error.message);
      return { authError: error.message };
    }
  }

  return null;
}

export default function AdminLogin() {
  let actionData = useActionData<{ authError?: string } | null>();

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
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
              autoComplete="username"
              autoFocus
            />
            <InputError
              messages={[actionData?.authError || ""]}
              className="mt-2"
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
            <PrimaryButton className="w-full justify-center">
              Login
            </PrimaryButton>
          </div>
        </Form>
      </div>
    </div>
  );
}
