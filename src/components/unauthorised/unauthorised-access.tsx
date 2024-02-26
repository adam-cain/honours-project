import { Lock } from "lucide-react"
import Base from './base'

export default function Unauthorized({ orgName }: { orgName: string }) {
    return (
        <Base>
            <Lock className="w-10 h-10 mx-auto" />
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-center">
                Unauthorized Access
            </h3>
            <p className="text-sm mx-auto max-w-[400px] text-center">
                You do not have permission to access {orgName}. Please contact the organization owner to request access.
            </p>
            <div className="flex justify-center">
                <button className=" border inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md w-full">
                    Request Access
                </button>
            </div>
        </Base>
    )
}

