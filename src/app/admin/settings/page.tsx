"use client"

import { useState } from "react"
import { 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Database, 
  Server, 
  Clock, 
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Key,
  Globe,
  Mail,
  Smartphone,
  Calendar,
  HardDrive
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function SystemSettingsPage() {
  // State for API configurations
  const [apiKeys, setApiKeys] = useState({
    paymentGateway: "••••••••••••••••",
    sportsData: "••••••••••••••••",
    emailService: "••••••••••••••••",
    pushNotification: "••••••••••••••••",
  })
  
  // State for payment gateway settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripe: true,
    paypal: true,
    applePay: false,
    googlePay: false,
    transactionFee: 2.9,
    testMode: false
  })
  
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newPrediction: true,
    predictionResult: true,
    subscriptionExpiry: true,
    promotionalEmails: false,
    emailTemplate: "default"
  })
  
  // State for security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiry: 90,
    minPasswordLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    sessionTimeout: 30,
    ipRestriction: false,
    twoFactorAuth: true
  })
  
  // State for backup settings
  const [backupSettings, setBackupSettings] = useState({
    frequency: "daily",
    time: "02:00",
    retentionDays: 30,
    storageLocation: "cloud",
    includeMedia: true,
    includeUserData: true,
    includeSettings: true
  })
  
  // State for API status
  const [apiStatus, setApiStatus] = useState({
    paymentGateway: "operational",
    sportsData: "operational",
    emailService: "degraded",
    pushNotification: "operational"
  })
  
  // State for API usage
  const [apiUsage, setApiUsage] = useState({
    paymentGateway: 45,
    sportsData: 78,
    emailService: 32,
    pushNotification: 15
  })
  
  // Handle save settings
  const handleSaveSettings = (section: string) => {
    console.log(`Saving ${section} settings`)
    // In a real app, you would call an API to save the settings
  }
  
  // Handle regenerate API key
  const handleRegenerateKey = (service: string) => {
    console.log(`Regenerating API key for ${service}`)
    // In a real app, you would call an API to regenerate the key
  }
  
  // Handle test connection
  const handleTestConnection = (service: string) => {
    console.log(`Testing connection for ${service}`)
    // In a real app, you would call an API to test the connection
  }
  
  // Handle backup now
  const handleBackupNow = () => {
    console.log("Initiating manual backup")
    // In a real app, you would call an API to initiate a backup
  }
  
  // Handle restore from backup
  const handleRestoreFromBackup = () => {
    console.log("Opening restore dialog")
    // In a real app, you would open a dialog to select a backup to restore from
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
          <p className="text-muted-foreground">
            Configure system-wide settings for your sports prediction platform.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>
      
      {/* Settings Tabs */}
      <Tabs defaultValue="api" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="api" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">API</span>
            <span className="md:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Payment</span>
            <span className="md:hidden">Pay</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Notifications</span>
            <span className="md:hidden">Notif</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Security</span>
            <span className="md:hidden">Sec</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Backup</span>
            <span className="md:hidden">Backup</span>
          </TabsTrigger>
        </TabsList>
        
        {/* API Configurations Tab */}
        <TabsContent value="api" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Gateway API</CardTitle>
                <Badge 
                  variant={apiStatus.paymentGateway === "operational" ? "default" : "destructive"}
                  className="ml-2"
                >
                  {apiStatus.paymentGateway === "operational" ? "Operational" : "Issues Detected"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">Usage: {apiUsage.paymentGateway}% of quota</div>
                <Progress value={apiUsage.paymentGateway} className="h-2 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-api-key">API Key</Label>
                    <Button variant="outline" size="sm" onClick={() => handleRegenerateKey("paymentGateway")}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                  <div className="flex">
                    <Input 
                      id="payment-api-key" 
                      value={apiKeys.paymentGateway} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button variant="secondary" className="rounded-l-none">
                      Show
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("paymentGateway")}>
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sports Data API</CardTitle>
                <Badge 
                  variant={apiStatus.sportsData === "operational" ? "default" : "destructive"}
                  className="ml-2"
                >
                  {apiStatus.sportsData === "operational" ? "Operational" : "Issues Detected"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">Usage: {apiUsage.sportsData}% of quota</div>
                <Progress value={apiUsage.sportsData} className="h-2 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sports-api-key">API Key</Label>
                    <Button variant="outline" size="sm" onClick={() => handleRegenerateKey("sportsData")}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                  <div className="flex">
                    <Input 
                      id="sports-api-key" 
                      value={apiKeys.sportsData} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button variant="secondary" className="rounded-l-none">
                      Show
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("sportsData")}>
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Service API</CardTitle>
                <Badge 
                  variant={apiStatus.emailService === "operational" ? "default" : 
                          apiStatus.emailService === "degraded" ? "warning" : "destructive"}
                  className="ml-2"
                >
                  {apiStatus.emailService === "operational" ? "Operational" : 
                   apiStatus.emailService === "degraded" ? "Degraded" : "Down"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">Usage: {apiUsage.emailService}% of quota</div>
                <Progress value={apiUsage.emailService} className="h-2 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-api-key">API Key</Label>
                    <Button variant="outline" size="sm" onClick={() => handleRegenerateKey("emailService")}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                  <div className="flex">
                    <Input 
                      id="email-api-key" 
                      value={apiKeys.emailService} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button variant="secondary" className="rounded-l-none">
                      Show
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("emailService")}>
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Push Notification API</CardTitle>
                <Badge 
                  variant={apiStatus.pushNotification === "operational" ? "default" : "destructive"}
                  className="ml-2"
                >
                  {apiStatus.pushNotification === "operational" ? "Operational" : "Issues Detected"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">Usage: {apiUsage.pushNotification}% of quota</div>
                <Progress value={apiUsage.pushNotification} className="h-2 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-api-key">API Key</Label>
                    <Button variant="outline" size="sm" onClick={() => handleRegenerateKey("pushNotification")}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                  <div className="flex">
                    <Input 
                      id="push-api-key" 
                      value={apiKeys.pushNotification} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button variant="secondary" className="rounded-l-none">
                      Show
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("pushNotification")}>
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>API Error Logs</CardTitle>
              <CardDescription>
                Recent API errors and troubleshooting information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <div className="font-medium">Email Service API - Rate Limit Warning</div>
                    <Badge variant="outline" className="ml-auto">2 hours ago</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Approaching daily rate limit (85%). Consider upgrading your plan or optimizing email sending patterns.
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    <div className="font-medium">Sports Data API - Authentication Error</div>
                    <Badge variant="outline" className="ml-auto">Yesterday</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Temporary authentication failure at 14:32. System automatically recovered after 3 retries.
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <div className="font-medium">All Systems Operational</div>
                    <Badge variant="outline" className="ml-auto">Current Status</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    All API services are currently operational with normal response times.
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Error Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payment Gateway Settings Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processors</CardTitle>
              <CardDescription>
                Configure which payment methods are available to your users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <img src="/placeholder.svg?height=24&width=24" alt="Stripe" className="h-6 w-6" />
                      <Label htmlFor="stripe-enabled">Stripe</Label>
                    </div>
                    <Switch 
                      id="stripe-enabled" 
                      checked={paymentSettings.stripe} 
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, stripe: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <img src="/placeholder.svg?height=24&width=24" alt="PayPal" className="h-6 w-6" />
                      <Label htmlFor="paypal-enabled">PayPal</Label>
                    </div>
                    <Switch 
                      id="paypal-enabled" 
                      checked={paymentSettings.paypal} 
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paypal: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <img src="/placeholder.svg?height=24&width=24" alt="Apple Pay" className="h-6 w-6" />
                      <Label htmlFor="apple-pay-enabled">Apple Pay</Label>
                    </div>
                    <Switch 
                      id="apple-pay-enabled" 
                      checked={paymentSettings.applePay} 
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, applePay: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <img src="/placeholder.svg?height=24&width=24" alt="Google Pay" className="h-6 w-6" />
                      <Label htmlFor="google-pay-enabled">Google Pay</Label>
                    </div>
                    <Switch 
                      id="google-pay-enabled" 
                      checked={paymentSettings.googlePay} 
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, googlePay: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transaction Settings</CardTitle>
              <CardDescription>
                Configure transaction fees and payment processing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="transaction-fee">Transaction Fee (%)</Label>
                  <Input 
                    id="transaction-fee" 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="100" 
                    value={paymentSettings.transactionFee} 
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings, 
                      transactionFee: parseFloat(e.target.value)
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    This fee will be added to all transactions. Set to 0 for no fee.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="ngn">NGN (₦)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="test-mode">Test Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, all transactions will be processed in test mode
                  </p>
                </div>
                <Switch 
                  id="test-mode" 
                  checked={paymentSettings.testMode} 
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, testMode: checked})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleSaveSettings("payment")}>
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>
                Overview of payment processing performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Success Rate</div>
                    <div className="text-2xl font-bold">98.7%</div>
                    <div className="text-xs text-muted-foreground">+0.5% from last month</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Average Processing Time</div>
                    <div className="text-2xl font-bold">1.2s</div>
                    <div className="text-xs text-muted-foreground">-0.3s from last month</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Failed Transactions</div>
                    <div className="text-2xl font-bold">1.3%</div>
                    <div className="text-xs text-muted-foreground">-0.5% from last month</div>
                  </div>
                </div>
                
                <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Payment processing performance chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Rules</CardTitle>
              <CardDescription>
                Configure when and how notifications are sent to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-prediction">New Prediction Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify users when new predictions are available
                    </p>
                  </div>
                  <Switch 
                    id="new-prediction" 
                    checked={notificationSettings.newPrediction} 
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newPrediction: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="prediction-result">Prediction Result Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify users when predictions they've viewed have results
                    </p>
                  </div>
                  <Switch 
                    id="prediction-result" 
                    checked={notificationSettings.predictionResult} 
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, predictionResult: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="subscription-expiry">Subscription Expiry Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify users when their subscription is about to expire
                    </p>
                  </div>
                  <Switch 
                    id="subscription-expiry" 
                    checked={notificationSettings.subscriptionExpiry} 
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, subscriptionExpiry: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotional-emails">Promotional Emails</Label>
                    <p className="text-xs text-muted-foreground">
                      Send promotional emails about new features and offers
                    </p>
                  </div>
                  <Switch 
                    id="promotional-emails" 
                    checked={notificationSettings.promotionalEmails} 
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, promotionalEmails: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => handleSaveSettings("notifications")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Manage email templates for different notification types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-template">Default Email Template</Label>
                <Select 
                  value={notificationSettings.emailTemplate} 
                  onValueChange={(value) => setNotificationSettings({...notificationSettings, emailTemplate: value})}
                >
                  <SelectTrigger id="email-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal Template</SelectItem>
                    <SelectItem value="modern">Modern Template</SelectItem>
                    <SelectItem value="branded">Branded Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="welcome-email">
                  <AccordionTrigger>Welcome Email</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Label htmlFor="welcome-email-subject">Subject Line</Label>
                      <Input id="welcome-email-subject" defaultValue="Welcome to PredictSS - Your Sports Prediction Platform" />
                      
                      <Label htmlFor="welcome-email-content">Email Content</Label>
                      <Textarea 
                        id="welcome-email-content" 
                        className="min-h-[200px]"
                        defaultValue="Dear {{user.name}},\n\nWelcome to PredictSS! We're excited to have you join our community of sports prediction enthusiasts.\n\nYour account has been successfully created and you can now start exploring our platform.\n\nBest regards,\nThe PredictSS Team"
                      />
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Preview Email
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="prediction-result">
                  <AccordionTrigger>Prediction Result</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Label htmlFor="prediction-email-subject">Subject Line</Label>
                      <Input id="prediction-email-subject" defaultValue="Your Prediction Results Are In!" />
                      
                      <Label htmlFor="prediction-email-content">Email Content</Label>
                      <Textarea 
                        id="prediction-email-content" 
                        className="min-h-[200px]"
                        defaultValue="Hello {{user.name}},\n\nThe results for your recent predictions are now available!\n\nPrediction: {{prediction.description}}\nResult: {{prediction.result}}\n\nLog in to your account to see more details.\n\nBest regards,\nThe PredictSS Team"
                      />
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Preview Email
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="subscription-expiry">
                  <AccordionTrigger>Subscription Expiry</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Label htmlFor="expiry-email-subject">Subject Line</Label>
                      <Input id="expiry-email-subject" defaultValue="Your PredictSS Subscription is Expiring Soon" />
                      
                      <Label htmlFor="expiry-email-content">Email Content</Label>
                      <Textarea 
                        id="expiry-email-content" 
                        className="min-h-[200px]"
                        defaultValue="Dear {{user.name}},\n\nYour PredictSS subscription is set to expire on {{subscription.expiryDate}}.\n\nTo continue enjoying our premium features, please renew your subscription before the expiry date.\n\nBest regards,\nThe PredictSS Team"
                      />
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Preview Email
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => handleSaveSettings("emailTemplates")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Targeting</CardTitle>
              <CardDescription>
                Configure which user groups receive different notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Users by Subscription Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="target-free" defaultChecked />
                    <Label htmlFor="target-free">Free Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="target-premium" defaultChecked />
                    <Label htmlFor="target-premium">Premium Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="target-vip" defaultChecked />
                    <Label htmlFor="target-vip">VIP Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="target-expired" />
                    <Label htmlFor="target-expired">Expired Subscriptions</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Target Users by Activity Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="target-active" defaultChecked />
                    <Label htmlFor="target-active">Active Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="target-inactive" />
                    <Label htmlFor="target-inactive">Inactive Users (30+ days)</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => handleSaveSettings("userTargeting")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>
                Configure password requirements and expiration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min-password-length">Minimum Password Length</Label>
                  <Input 
                    id="min-password-length" 
                    type="number" 
                    min="6" 
                    max="32" 
                    value={securitySettings.minPasswordLength} 
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings, 
                      minPasswordLength: parseInt(e.target.value)
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Input 
                    id="password-expiry" 
                    type="number" 
                    min="0" 
                    max="365" 
                    value={securitySettings.passwordExpiry} 
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings, 
                      passwordExpiry: parseInt(e.target.value)
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Set to 0 for no expiration
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Password Requirements</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="require-special-chars" 
                      checked={securitySettings.requireSpecialChars}
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings,
                        requireSpecialChars: checked === true
                      })}
                    />
                    <Label htmlFor="require-special-chars">Require special characters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="require-numbers" 
                      checked={securitySettings.requireNumbers}
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings,
                        requireNumbers: checked === true
                      })}
                    />
                    <Label htmlFor="require-numbers">Require numbers</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => handleSaveSettings("passwordPolicy")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Configure session timeout and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  min="5" 
                  max="1440" 
                  value={securitySettings.sessionTimeout} 
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings, 
                    sessionTimeout: parseInt(e.target.value)
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Time of inactivity before a user is automatically logged out
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">
                      Require two-factor authentication for all admin users
                    </p>
                  </div>
                  <Switch 
                    id="two-factor-auth" 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: checked
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ip-restriction">IP Restriction</Label>
                    <p className="text-xs text-muted-foreground">
                      Restrict admin access to specific IP addresses
                    </p>
                  </div>
                  <Switch 
                    id="ip-restriction" 
                    checked={securitySettings.ipRestriction}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      ipRestriction: checked
                    })}
                  />
                </div>
                
                {securitySettings.ipRestriction && (
                  <div className="mt-2">
                    <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                    <Textarea 
                      id="allowed-ips" 
                      placeholder="Enter IP addresses, one per line"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter one IP address or CIDR range per line (e.g., 192.168.1.1 or 192.168.1.0/24)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => handleSaveSettings("sessionManagement")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Backup Configuration Tab */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup Schedule</CardTitle>
              <CardDescription>
                Configure automated backup frequency and timing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select 
                    value={backupSettings.frequency}
                    onValueChange={(value) => setBackupSettings({
                      ...backupSettings,
                      frequency: value
                    })}
                  >
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-time">Backup Time</Label>
                  <Input 
                    id="backup-time" 
                    type="time" 
                    value={backupSettings.time} 
                    onChange={(e) => setBackupSettings({
                      ...backupSettings, 
                      time: e.target.value
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time of day to run scheduled backups (24-hour format)
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retention-days">Retention Period (days)</Label>
                <Input 
                  id="retention-days" 
                  type="number" 
                  min="1" 
                  max="365" 
                  value={backupSettings.retentionDays} 
                  onChange={(e) => setBackupSettings({
                    ...backupSettings, 
                    retentionDays: parseInt(e.target.value)
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Number of days to keep backups before automatic deletion
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => handleSaveSettings("backupSchedule")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Backup Storage</CardTitle>
              <CardDescription>
                Configure where backups are stored and what data is included
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storage-location">Storage Location</Label>
                <Select 
                  value={backupSettings.storageLocation}
                  onValueChange={(value) => setBackupSettings({
                    ...backupSettings,
                    storageLocation: value
                  })}
                >
                  <SelectTrigger id="storage-location">
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="both">Both Local and Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Backup Content</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-user-data" 
                      checked={backupSettings.includeUserData}
                      onCheckedChange={(checked) => setBackupSettings({
                        ...backupSettings,
                        includeUserData: checked === true
                      })}
                    />
                    <Label htmlFor="include-user-data">User data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-media" 
                      checked={backupSettings.includeMedia}
                      onCheckedChange={(checked) => setBackupSettings({
                        ...backupSettings,
                        includeMedia: checked === true
                      })}
                    />
                    <Label htmlFor="include-media">Media files</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-settings" 
                      checked={backupSettings.includeSettings}
                      onCheckedChange={(checked) => setBackupSettings({
                        ...backupSettings,
                        includeSettings: checked === true
                      })}
                    />
                    <Label htmlFor="include-settings">System settings</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => handleSaveSettings("backupStorage")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manual Backup & Restore</CardTitle>
              <CardDescription>
                Create manual backups or restore from previous backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Button className="flex-1" onClick={handleBackupNow}>
                  <Database className="mr-2 h-4 w-4" />
                  Backup Now
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleRestoreFromBackup}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restore from Backup
                </Button>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="font-medium mb-2">Recent Backups</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Full Backup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">2023-11-15 02:00</Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Full Backup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">2023-11-14 02:00</Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Full Backup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">2023-11-13 02:00</Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}