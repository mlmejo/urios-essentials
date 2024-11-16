"use client";

import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "react-aria-carousel";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselItem as ICarouselItem, Product } from "~/types";
import styles from "./styles.module.css";

export default function ProductCarousel({
  products,
}: {
  products?: Product[];
}) {
  let carouselItems = createCarouselItems(products);

  return (
    <Carousel
      aria-label="Featured Collection"
      className={styles.root}
      spaceBetweenItems="12px"
      loop="infinite"
      autoplay
      autoplayInterval={3000}
    >
      <CarouselButton className={styles.button} data-dir="prev" dir="prev">
        <ChevronLeft className="size-8 text-gray-800" />
      </CarouselButton>
      <CarouselScroller className={styles.scroller}>
        {carouselItems?.map((item, index) => (
          <Item key={index} src={item.url} />
        ))}
      </CarouselScroller>
      <CarouselButton className={styles.button} dir="next" data-dir="next">
        <ChevronRight className="size-8 text-gray-800" />
      </CarouselButton>
      <CarouselTabs className={styles.tabs}>
        {(page) => <CarouselTab index={page.index} className={styles.tab} />}
      </CarouselTabs>
    </Carousel>
  );
}

function Item({ src }: { src: string }) {
  return (
    <CarouselItem className="flex items-center justify-center rounded-sm">
      <img src={src} alt="Carousel Image" className="h-full object-contain" />
    </CarouselItem>
  );
}

export function createCarouselItems(
  products: Product[] | undefined,
): ICarouselItem[] {
  const carouselItems: ICarouselItem[] = [];

  products?.forEach((product) => {
    product.images?.forEach((image) =>
      carouselItems.push({
        url: `http://localhost:1337${image.url}`,
        category: product.category?.name || "Unknown", // Fallback for missing category
      }),
    );
  });

  return carouselItems;
}
