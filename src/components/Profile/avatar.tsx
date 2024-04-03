"use client";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

type Props = {
  image?: string;
  username: string;
  size?: number;
  textSize?: "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl" | "text-3xl" | "text-4xl" | "text-5xl" | "text-6xl";
}


export default function UserAvatar({ image, username, size = 8, textSize="text-sm" }: Props) {

  const sizeClasses = `${"h-"+size} ${"w-"+size} ${textSize}`

  const getInitials = (name: string) => {
    const names = name.split(/[ _]/);
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <>
      {image ? (
        // If there's an image, render the Image component
        <Image
          className={`rounded-full aspect-square object-cover ${"h"+size} ${"w"+size}`}
          src={image}
          alt=""
          width={size*4}
          height={size*4}
        />
      ) : (
        <div className={cn(" h-32 w-32 flex items-center justify-center rounded-full bg-gray-500 text-white min-w-[32px] min-h-[32px]", sizeClasses)} style={{height: `${"h-"+size}`}}>
          {getInitials(username || 'Err')}
        </div>
      )}
    </>
  );
}
