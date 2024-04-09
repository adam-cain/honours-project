import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import LoadingDots from "../icons/loading-dots";

export default function ModalSubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
      <button
        className={cn(
          "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
          pending
            ? "cursor-not-allowed  border-stone-700 bg-stone-800 text-stone-300"
            : " bg-black text-white border-stone-700 hover:border-stone-200 hover:bg-black hover:text-white active:bg-stone-800",
        )}
        disabled={pending}
      >
        {pending ? <LoadingDots color="#808080" /> : <p>{children}</p>}
      </button>
    );
  }