import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

/**
 * Renders an accessible spinning loader icon as an SVG.
 *
 * @param className - Additional CSS class names to apply to the icon.
 * @returns The Loader2Icon SVG element configured with role="status", `aria-label="Loading"`, and a spinning animation.
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
