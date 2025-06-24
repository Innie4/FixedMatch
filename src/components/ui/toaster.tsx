'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Remove onPause to avoid Radix/React type mismatch
        const { onPause, ...toastProps } = props;
        // @ts-ignore Radix Toast typing mismatch with React event handlers
        return (
          <Toast key={id} asChild {...toastProps}>
            <li>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              {/* Render the action if present, using action.action for ToastActionElement */}
              {action && action.action}
              <ToastClose />
            </li>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
