import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { ImageUp } from "lucide-react";
import { useState } from "react";
import { requireAuthCookie } from "~/auth/auth";
import InputError from "~/components/input-error";
import InputLabel from "~/components/input-label";
import PrimaryButton from "~/components/primary-button";
import SelectInput from "~/components/select-input";
import TextInput from "~/components/text-input";
import TextArea from "~/components/textarea";
import AdminLayout from "~/layouts/admin";
import { createProduct } from "~/products/queries";
import { Category } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "New Product" }];
};

export async function action({ request }: ActionFunctionArgs) {
  let { jwt } = await requireAuthCookie(request);
  let formData = await request.formData();

  try {
    let errors = await createProduct(formData, jwt);
    if (errors) {
      return { fieldErrors: errors.fieldErrors };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in createProduct action:", error);
    }
  }
  return redirect("/admin/products");
}

export async function loader({ request }: LoaderFunctionArgs) {
  let { jwt } = await requireAuthCookie(request);
  try {
    let response = await fetch("http://localhost:1337/api/categories", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    let categories = (await response.json()).data as Category[];
    return { categories };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch categories");
    }
  }
  return { categories: [] } as { categories: Category[] };
}

export default function AdminProductsNew() {
  let actionData = useActionData<typeof action>();
  let { categories } = useLoaderData<typeof loader>();

  let [files, setFiles] = useState<File[]>([]);

  return (
    <AdminLayout>
      <div className="py-12">
        <div className="mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
              New Product
            </h2>

            <Form method="post" encType="multipart/form-data" className="mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="category">Category</InputLabel>
                      <SelectInput
                        name="category"
                        id="category"
                        className="mt-1 block w-full"
                      >
                        <option value="">Select a category</option>
                        {categories?.map((category) => (
                          <option key={category.id} value={category.documentId}>
                            {category.displayName}
                          </option>
                        ))}
                      </SelectInput>
                      <InputError
                        messages={actionData?.fieldErrors?.category}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <InputLabel htmlFor="name">
                        Name<span className="text-red-500">*</span>
                      </InputLabel>
                      <TextInput
                        name="name"
                        id="name"
                        className="mt-1 block w-full"
                        required
                        autoComplete="off"
                        autoFocus
                      />
                    </div>
                    <InputError messages={actionData?.fieldErrors?.name} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <InputLabel htmlFor="slug">
                        Slug<span className="text-red-500">*</span>
                      </InputLabel>
                      <TextInput
                        name="slug"
                        id="slug"
                        className="mt-1 block w-full"
                        required
                        min={0}
                      />
                    </div>

                    <div>
                      <InputLabel htmlFor="sku">
                        SKU<span className="text-red-500">*</span>
                      </InputLabel>
                      <TextInput
                        name="sku"
                        id="sku"
                        className="mt-1 block w-full"
                        required
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <TextArea
                      name="description"
                      id="description"
                      className="mt-1 block w-full resize-none"
                    ></TextArea>
                  </div>
                </div>

                <div className="flex flex-col gap-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <InputLabel htmlFor="price">
                        Price<span className="text-red-500">*</span>
                      </InputLabel>
                      <TextInput
                        type="number"
                        name="price"
                        id="price"
                        className="mt-1 block w-full"
                        required
                        min={0}
                      />
                    </div>

                    <div>
                      <InputLabel htmlFor="stock">
                        Available Quantity
                        <span className="text-red-500">*</span>
                      </InputLabel>
                      <TextInput
                        type="number"
                        name="stock"
                        id="stock"
                        className="mt-1 block w-full"
                        required
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <InputLabel id="file">
                      Product Images<span className="text-red-500">*</span>
                    </InputLabel>
                    <div className="mt-1 flex flex-col items-center justify-center rounded-md border border-gray-300 py-6 shadow-sm">
                      <input
                        type="file"
                        id="files"
                        name="files"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;
                          setFiles(Array.from(files));
                        }}
                      />
                      <ImageUp className="size-10 shrink-0 text-gray-500" />
                      <label
                        htmlFor="files"
                        className="mt-2 rounded-md bg-cornflower-blue-500 px-4 py-2 text-sm font-semibold text-white duration-150 ease-in-out hover:bg-cornflower-blue-600"
                      >
                        Select files
                      </label>

                      <div className="mt-2 flex max-w-[40ch] items-center gap-x-2 truncate text-center text-sm font-medium text-gray-700">
                        {files.map((file) => (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="h-24"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link to="/admin/products" className="btn-secondary">
                  Cancel
                </Link>

                <PrimaryButton type="submit" className="ms-2">
                  Create Product
                </PrimaryButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
