"use client";

import { BuildingIcon } from 'lucide-react';
import Image from 'next/image'
import CardBase from './card-base';
import { useRouter } from 'next/navigation';

interface CardProps {
    name: string;
    logo: string;
}

const imageSize = 12;
const imageMargin = 4;

export default function Card({ name, logo }: CardProps) {

    const router = useRouter();

    return (
        <CardBase onclick={() => router.push("/"+name)}>
            <div className={`w-${imageSize} h-${imageSize} rounded-full object-cover border flex items-center justify-center`}>
            {logo ? (
                // If there's an logo, render the Image component
                <Image
                    className={`w-${imageSize-2} h-${imageSize-2} rounded-full object-cover`}
                    src={logo}
                    alt=""
                    width={20}
                    height={20}
                />
            ) : (
                    <BuildingIcon className={`w-${imageSize - imageMargin} h-${imageSize - imageMargin}`} />
            )}
            </div>
            <h3 className="text-center text-2xl font-bold ">{name}</h3>
        </CardBase>
    )
}