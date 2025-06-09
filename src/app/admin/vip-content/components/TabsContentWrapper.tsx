import { TabsContent } from '@/components/ui/tabs'
import { ReactNode } from 'react'

interface TabsContentWrapperProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsContentWrapper({ value, children, className = '' }: TabsContentWrapperProps) {
  return (
    <TabsContent value={value} className={className}>
      {children}
    </TabsContent>
  )
}
