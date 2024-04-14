import React, { FC } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dot } from 'lucide-react';


interface DeployableProps {
  name: string;
  description: string;
  button: React.ReactNode;
  published?: boolean;
}

const DeployableCard: FC<DeployableProps> = ({ name, description, button, published }) => {
  return (
    <Card className=''>
      <CardHeader className='flex-inline flex-row p-3 items-center justify-between max-w-full space-y-0'>
        <div className='flex flex-row'>
          <div className='flex flex-col ml-2 justify-center'>
            <CardTitle>{name}</CardTitle>
            {description ?
              <CardDescription><p className=' truncate'>{description}</p></CardDescription>
              : null}
          </div>
        </div>

        <div className='flex flex-row m-0'>
          {published ? 
          <div className='size-10 flex'>
            <Dot className={`m-auto size-8 ${published ? "text-red-400" : "text-green-400"}`} />
          </div>
          : null}
          {button}
        </div>
      </CardHeader>
    </Card>
  );
};

export default DeployableCard;
