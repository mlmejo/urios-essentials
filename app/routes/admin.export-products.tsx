import { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { Product } from "~/types";

function jsonToCSV(data: Product[]): string {
  if (!data.length) return "";

  const headers = Object.keys(data[0]).join(",") + "\n";
  const rows = data
    .map((product) =>
      Object.values(product)
        .map((value) =>
          typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value,
        )
        .join(","),
    )
    .join("\n");

  return headers + rows;
}

export async function loader({ request }: LoaderFunctionArgs) {
  let { jwt } = await requireAuthCookie(request);

  try {
    let response = await fetch("http://localhost:1337/api/products", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    let products = (await response.json()).data as Product[];
    let csvData = jsonToCSV(products);

    return new Response(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=products.csv",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return null;
  }
}
