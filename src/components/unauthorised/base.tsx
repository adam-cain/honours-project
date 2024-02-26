export default function Base({ children }: { children: React.ReactNode}) {
    return (
        <div className=" h-full w-full flex items-center justify-center">
            <div className="rounded-lg border shadow-sm w-1/2 min-w-[300px] max-w-[420px]">
                <div className="flex flex-col space-y-1.5 p-6 gap-y-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

