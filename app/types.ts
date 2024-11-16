export type Cart = CartItem[];

export interface CarouselItem {
  url: string;
  category: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Category {
  id?: string;
  documentId?: string;
  name: string;
  displayName: string;
}

export interface Image {
  id?: number;
  url: string;
}

export interface Product {
  id?: number;
  name: string;
  slug: number;
  sku: number;
  description: string;
  price: number;
  stock: number;
  documentId?: string;
  category?: Category;
  images?: Image[];
}

export interface StrapiError {
  error: {
    message: string;
    status: number;
  };
}

export interface OrderItem {
  documentId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  orderStatus: string;
}
