import { Provider, defaultTheme } from "@adobe/react-spectrum";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getAuthFromRequest } from "~/auth/auth";
import Navigation from "~/layouts/navigation";

export async function loader({ request }: LoaderFunctionArgs) {
  let authData = await getAuthFromRequest(request);
  return { user: authData?.user.email };
}

export default function Layout() {
  let { user } = useLoaderData<typeof loader>();

  return (
    <Provider theme={defaultTheme}>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navigation user={user} />

        <Outlet />
      </div>
    </Provider>
  );
}
