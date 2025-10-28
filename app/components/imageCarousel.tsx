"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import 'swiper/css';
import 'swiper/css/navigation';

type ImageItem = {
  src: string
  alt: string
}

export default function ImageCarousel({ images }: { images: Array<ImageItem> }) {
  if (!images) return;

  return (
    <Swiper navigation className="h-screen w-full">
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="flex h-full w-full items-center bg-stone-500">
            <Image src={image.src} alt={image.alt} className="" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
