"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";

import './imageCarousel.scss';
import 'swiper/css';
import 'swiper/css/navigation';

// type ImageItem = {
// src: string
// alt: string
// }

// export default function ImageCarousel({ images }: { images: Array<ImageItem> }) {
export default function ImageCarousel({ images }: { images: string[] }) {
  if (!images) return;

  return (
    <Swiper modules={[Navigation]} slidesPerView={1.2} spaceBetween={20} centeredSlides={true} navigation className="w-full">
      {images.map((image, index) => (
        <SwiperSlide key={index} data-thing={image}>
          <div className="flex w-full items-center ">
            <Image src={image} alt={"something"} className="object-contain aspect-video max-h-[90vh] bg-stone-300 dark:bg-stone-900" width={1920} height={1080} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
