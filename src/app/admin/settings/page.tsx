'use client'

import { useState } from 'react'
import {
  Shield,
  Bell,
  CreditCard,
  Database,
  Server,
  Save,
  RefreshCw,
  CheckCircle2,
  Key,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ApiConfig {
  paymentGateway: string
  sportsData: string
  emailService: string
  pushNotification: string
}

interface PaymentSettings {
  stripe: boolean
  paypal: boolean
  applePay: boolean
  googlePay: boolean
  transactionFee: number
  testMode: boolean
}

interface NotificationSettings {
  newPrediction: boolean
  predictionResult: boolean
  subscriptionExpiry: boolean
  promotionalEmails: boolean
  emailTemplate: string
}

interface SecuritySettings {
  passwordExpiry: number
  minPasswordLength: number
  requireSpecialChars: boolean
  requireNumbers: boolean
  sessionTimeout: number
  twoFactorAuth: boolean
}

interface BackupSettings {
  frequency: string
  time: string
  retentionDays: number
  storageLocation: string
  includeMedia: boolean
  includeUserData: boolean
  includeSettings: boolean
}

export default function SystemSettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiConfig>({
    paymentGateway: '••••••••••••••••',
    sportsData: '••••••••••••••••',
    emailService: '••••••••••••••••',
    pushNotification: '••••••••••••••••',
  })

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripe: true,
    paypal: true,
    applePay: false,
    googlePay: false,
    transactionFee: 2.9,
    testMode: false,
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newPrediction: true,
    predictionResult: true,
    subscriptionExpiry: true,
    promotionalEmails: false,
    emailTemplate: 'default',
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordExpiry: 90,
    minPasswordLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    sessionTimeout: 30,
    twoFactorAuth: true,
  })

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30,
    storageLocation: 'cloud',
    includeMedia: true,
    includeUserData: true,
    includeSettings: true,
  })

  const handleSaveSettings = (section: string) => {
    switch (section) {
      case 'api':
        console.log('Saving API settings:', apiKeys)
        break
      case 'payment':
        console.log('Saving payment settings:', paymentSettings)
        break
      case 'notifications':
        console.log('Saving notification settings:', notificationSettings)
        break
      case 'security':
        console.log('Saving security settings:', securitySettings)
        break
      case 'backup':
        console.log('Saving backup settings:', backupSettings)
        break
    }
  }

  const handleRegenerateKey = (service: keyof ApiConfig) => {
    setApiKeys((prev) => ({
      ...prev,
      [service]: '••••••••••••••••',
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/settings">System Settings</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings for your platform.</p>
        </div>

        <Button onClick={() => handleSaveSettings('all')}>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="api">
            <Server className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">API</span>
            <span className="md:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Payment</span>
            <span className="md:hidden">Pay</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Notifications</span>
            <span className="md:hidden">Notif</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Security</span>
            <span className="md:hidden">Sec</span>
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Backup</span>
            <span className="md:hidden">Backup</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for various services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiKeys).map(([service, key]) => (
                <div key={service} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label>{service}</Label>
                    <div className="flex items-center gap-2">
                      <Input value={key} readOnly className="font-mono" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRegenerateKey(service as keyof ApiConfig)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure payment methods and settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(paymentSettings).map(([key, value]) =>
                key !== 'transactionFee' && key !== 'testMode' ? (
                  <div key={key} className="flex items-center justify-between">
                    <Label>{key}</Label>
                    <Switch
                      checked={value as boolean}
                      onCheckedChange={(checked) =>
                        setPaymentSettings((prev) => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ) : null
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents similarly */}
      </Tabs>
    </div>
  )
}
