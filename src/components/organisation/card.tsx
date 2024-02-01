import Image from 'next/image'

interface CardProps {
    name: string;
    description: string;
    logo: string;
}

export default function Card({name, description, logo}: CardProps) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md">
            <div className="p-6 flex flex-col items-center space-y-2">
                <Image src={logo} alt={"/public/logo.png"} />
                <img
                    src="/placeholder.svg"
                    alt="Organization Logo"
                    className="w-24 h-24 rounded-full object-cover"
                    width="100"
                    height="100"
                    style={{ aspectRatio: "100 / 100", objectFit: "cover" }}
                />
                <h3 className="whitespace-nowrap tracking-tight text-2xl font-bold">{name}</h3>
            </div>
            <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500">
                    {description}
                </p>
            </div>
        </div>
    )
}