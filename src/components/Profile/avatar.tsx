import Image from 'next/image';


import React from 'react'

type Props = {
  image?: string;
  username: string;
  className?: string;
  textSize?: "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl" | "text-3xl" | "text-4xl" | "text-5xl" | "text-6xl";
}


export default function UserAvatar({ image, username, className = "", textSize="text-sm" }: Props) {

  const getInitials = (name: string) => {
    const names = name.split(/[ _]/);
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };
  const initialsStyle = {
    // Adjust the font size dynamically based on the container's width
    // This example uses a combination of viewport width (vw) and min/max for scaling
    // You might need to adjust the values based on your design needs
    fontSize: `calc(10px + 2vw)`, // Scales with the viewport, adjust as needed
    // fontSize: `calc(min(max(32px, 4vw), 16px))`, // Scales with the viewport, adjust as needed

    // Ensure the font size does not get too small or too large
    // You might need to adjust min and max values based on your container size
    // fontSize: `calc(min(max(12px, 4vw), 16px))`
  };

  return (
    <>
      {image ? (
        // If there's an image, render the Image component
        <Image
          className={`rounded-full aspect-square object-cover ${className}`}
          src={image}
          alt=""
          width={32}
          height={32}
        />
      ) : (
        <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-gray-500 text-white min-w-[32px] min-h-[32px] ${className} ${textSize}`}>
          {getInitials(username || 'Err')}
        </div>
      )}
    </>
  );
}
