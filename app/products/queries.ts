import { Image, Product } from "~/types";
import { createProductSchema } from "./validate";

export async function createProduct(formData: FormData, jwt: string) {
  let data = Object.fromEntries(formData);
  let result = createProductSchema.safeParse(data);

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors);
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  let uploadResponse = await fetch("http://localhost:1337/api/upload", {
    method: "post",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  let uploadedImages = (await uploadResponse.json()) as Image[];

  let newEntry = {
    data: {
      ...result.data,
      images: uploadedImages.map((image) => image.id),
    },
  };

  try {
    let response = await fetch("http://localhost:1337/api/products", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(newEntry),
    });

    let result = await response.json();
    if (result.data == null) {
      console.error(result.error.details);
      return;
    }
  } catch (error) {
    if (uploadedImages.length > 0) {
      await Promise.all(
        uploadedImages.map((image) =>
          fetch(`http://localhost:1337/api/upload/files/${image.id}`, {
            method: "delete",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }),
        ),
      );
    }
  }

  return null;
}

export async function getProductsByCategory(categoryName: string) {
  let response = await fetch(
    `http://localhost:1337/api/products?populate=*&filters[category][name][$eq]=${categoryName}`,
  );

  return (await response.json()).data as Product[];
}

export async function getProductBySlug(slug: string) {
  let response = await fetch(
    `http://localhost:1337/api/products/?filters[slug][$eq]=${slug}&populate=*`,
  );

  return (await response.json()).data[0] as Product;
}
