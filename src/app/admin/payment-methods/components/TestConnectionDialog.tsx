'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface PaymentMethod {
  id: number
  name: string
  provider: string
  configuration: {
    publicKey?: string
    secretKey?: string
    testMode: boolean
  }
  testStatus?: 'success' | 'failed' | 'pending'
}

interface TestConnectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onTestComplete: (methodId: number, status: 'success' | 'failed') => void
  method: PaymentMethod | null
}

export function TestConnectionDialog({
  isOpen,
  onClose,
  onTestComplete,
  method,
}: TestConnectionDialogProps) {
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'failed' | null
    message: string
  }>({ status: null, message: '' })

  const handleTestConnection = async () => {
    if (!method) return

    setIsTesting(true)
    setTestResult({ status: null, message: '' })

    try {
      // Simulate API test call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, make actual API call to test connection
      // const response = await testPaymentGateway(method.provider, method.configuration)

      // Simulate random success/failure for demo
      const success = Math.random() > 0.3

      if (success) {
        setTestResult({
          status: 'success',
          message: 'Connection successful! Payment gateway is responding correctly.',
        })
        onTestComplete(method.id, 'success')
      } else {
        setTestResult({
          status: 'failed',
          message: 'Connection failed. Please check your API credentials and try again.',
        })
        onTestComplete(method.id, 'failed')
      }
    } catch (error) {
      setTestResult({
        status: 'failed',
        message: 'Connection test failed due to network error.',
      })
      onTestComplete(method.id, 'failed')
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusIcon = () => {
    if (isTesting) return <Loader2 className="h-5 w-5 animate-spin" />
    if (testResult.status === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />
    if (testResult.status === 'failed') return <XCircle className="h-5 w-5 text-red-600" />
    return <TestTube className="h-5 w-5" />
  }

  const getStatusColor = () => {
    if (testResult.status === 'success') return 'text-green-600'
    if (testResult.status === 'failed') return 'text-red-600'
    return 'text-gray-600'
  }

  if (!method) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Test Connection
          </DialogTitle>
          <DialogDescription>
            Test the connection to {method.name} payment gateway.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Method Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Provider:</span>
              <Badge variant="secondary">{method.provider}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Mode:</span>
              <Badge variant={method.configuration.testMode ? 'outline' : 'default'}>
                {method.configuration.testMode ? 'Test' : 'Live'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Public Key:</span>
              <span className="text-sm text-gray-500">
                {method.configuration.publicKey
                  ? `${method.configuration.publicKey.substring(0, 8)}...`
                  : 'Not configured'}
              </span>
            </div>
          </div>

          {/* Test Result */}
          {testResult.status && (
            <div
              className={`p-3 rounded-lg border ${
                testResult.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <p className={`text-sm ${getStatusColor()}`}>{testResult.message}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleTestConnection}
            disabled={isTesting || !method.configuration.publicKey}
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
