import { Lock } from "lucide-react"

export default function Unauthorized({ orgName }: { orgName: string }) {
    return (
        <div className=" h-full w-full flex items-center justify-center">
            <div className="rounded-lg border shadow-sm w-1/2 min-w-[300px] max-w-[420px]">
                <div className="flex flex-col space-y-1.5 p-6 gap-y-6">
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
                </div>
            </div>
        </div>
    )
}