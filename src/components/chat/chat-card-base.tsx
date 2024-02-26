interface BaseCardProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string; // Add this line
}

export default function BaseCard({ children, onClick, className = '' }: BaseCardProps) {
    return (
        <div
            className={`hover:scale-105 w-full rounded-lg border py-2 px-4 flex justify-between items-center ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}