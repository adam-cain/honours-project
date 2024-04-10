import React, { FC } from 'react';
import Image from 'next/image';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building } from 'lucide-react';

interface TeamProps {
  name: string;
  description: string;
  imageUrl: string;
  button: React.ReactNode;
}

const TeamCardBase: FC<TeamProps> = ({ name, description, imageUrl, button }) => {
  return (
    <Card className=''>
      <CardHeader className='flex-inline flex-row p-3 items-center justify-between max-w-full space-y-0'>
        <div className='flex flex-row'>
          <div>
            {imageUrl ?
              <div className='size-10 rounded flex'>
                <Image className='rounded' height={42} width={42} src={imageUrl} alt={'Team Image'} />
              </div>
              :
              <div className='size-10 rounded border flex'>
                <Building className='m-auto' />
              </div>
            }
          </div>
          <div className='flex flex-col ml-2 justify-center'>
            <CardTitle>{name}</CardTitle>
            {description ? 
            <CardDescription><p className=' truncate'>{description}</p></CardDescription> 
            : null}
          </div>
        </div>
        <div className='flex flex-row m-0'>
          {button}
        </div>
      </CardHeader>
    </Card>
  );
};

export default TeamCardBase;
