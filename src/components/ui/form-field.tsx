import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  htmlFor?: string
  error?: string
  description?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, label, htmlFor, error, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && htmlFor && (
          <Label htmlFor={htmlFor} className="block">
            {label}
          </Label>
        )}
        {children}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>
    )
  },
)
FormField.displayName = "FormField"

export { FormField }
