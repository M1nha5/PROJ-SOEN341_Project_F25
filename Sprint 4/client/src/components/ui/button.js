import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90",
    {
        variants: {
            variant: {
                default: "bg-blue-600 text-white hover:bg-blue-700",
                outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
    )
}
