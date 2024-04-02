import { AudioWaveform } from "lucide-react"

interface LogoProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function Logo(props: LogoProps) {
    return (
        <div className={`flex items-center gap-[2px] ${props.className}`}>
            <p className="text-collapse-transition text-3xl font-bold" style={props.style}>
                Auto
            </p>
            <AudioWaveform className="w-6 h-6 text-[#FFD700]" />
            <p className="text-collapse-transition text-3xl font-bold" style={props.style}>
                Flow
            </p>
        </div>
    );
}

