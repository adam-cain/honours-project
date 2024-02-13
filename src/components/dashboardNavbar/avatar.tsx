import  Image from 'next/image';
import { User } from "@/lib/types";


export default function UserAvatar({ data }: { data:  User} ) {
    // Function to extract initials from the username
    const getInitials = (name: string) => {
    const names = name.split(/[ _]/);
    const initials = names.map((n) => n[0]).join('');
      return initials.toUpperCase();
    };
    return (
      <>
        {data?.user.image ? (
          // If there's an image, render the Image component
          <Image
            className="rounded-full aspect-square object-cover"
            src={data.user.image}
            alt=""
            width={32}
            height={32}
          />
        ) : (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-500 text-white min-w-[32px] min-h-[32px]">
            {getInitials(data?.user.name || data?.user.email || 'Err')}
          </div>
        )}
      </>
    );
  }
  