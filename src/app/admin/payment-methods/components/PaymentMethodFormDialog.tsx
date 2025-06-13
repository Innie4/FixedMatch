'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Eye, EyeOff, TestTube } from 'lucide-react'
import { CountrySelector } from '@/components/ui/country-selector'
import { countries } from '@/lib/countries'

interface PaymentMethod {
  id: number
  name: string
  provider: 'flutterwave' | 'paystack' | 'stripe' | 'razorpay' | 'paypal' | 'square'
  type: 'card' | 'bank_transfer' | 'mobile_money' | 'crypto' | 'wallet'
  status: 'active' | 'inactive' | 'testing'
  countries: string[]
  configuration: {
    publicKey?: string
    secretKey?: string
    merchantId?: string
    webhookUrl?: string
    testMode: boolean
  }
  supportedCurrencies: string[]
  transactionFee: number
  createdAt: string
  updatedAt: string
  lastTested?: string
  testStatus?: 'success' | 'failed' | 'pending'
}

interface PaymentMethodFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (method: Partial<PaymentMethod>) => void
  method?: PaymentMethod | null
  mode: 'add' | 'edit'
}

const PROVIDERS = [
  { value: 'flutterwave', label: 'Flutterwave' },
  { value: 'paystack', label: 'Paystack' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'square', label: 'Square' },
]

const PAYMENT_TYPES = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'wallet', label: 'Digital Wallet' },
]

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'NGN',
  'GHS',
  'KES',
  'ZAR',
  'CAD',
  'AUD',
  'JPY',
  'CNY',
  'INR',
]

export function PaymentMethodFormDialog({
  isOpen,
  onClose,
  onSave,
  method,
  mode,
}: PaymentMethodFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    provider: '' as PaymentMethod['provider'],
    type: '' as PaymentMethod['type'],
    status: 'inactive' as PaymentMethod['status'],
    countries: [] as string[],
    configuration: {
      publicKey: '',
      secretKey: '',
      merchantId: '',
      webhookUrl: '',
      testMode: true,
    } as {
      publicKey?: string
      secretKey?: string
      merchantId?: string
      webhookUrl?: string
      testMode: boolean
    },
    supportedCurrencies: [] as string[],
    transactionFee: 0,
  })

  const [showSecretKey, setShowSecretKey] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  useEffect(() => {
    if (method && mode === 'edit') {
      setFormData({
        name: method.name,
        provider: method.provider,
        type: method.type,
        status: method.status,
        countries: method.countries,
        configuration: method.configuration,
        supportedCurrencies: method.supportedCurrencies,
        transactionFee: method.transactionFee,
      })
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        provider: '' as PaymentMethod['provider'],
        type: '' as PaymentMethod['type'],
        status: 'inactive',
        countries: [],
        configuration: {
          publicKey: '',
          secretKey: '',
          merchantId: '',
          webhookUrl: '',
          testMode: true,
        },
        supportedCurrencies: [],
        transactionFee: 0,
      })
    }
    setErrors({})
  }, [method, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Payment method name is required'
    }

    if (!formData.provider) {
      newErrors.provider = 'Provider is required'
    }

    if (!formData.type) {
      newErrors.type = 'Payment type is required'
    }

    if (formData.countries.length === 0) {
      newErrors.countries = 'At least one country must be selected'
    }

    if (formData.supportedCurrencies.length === 0) {
      newErrors.supportedCurrencies = 'At least one currency must be supported'
    }

    if (formData.transactionFee < 0) {
      newErrors.transactionFee = 'Transaction fee cannot be negative'
    }

    // Provider-specific validation
    if (formData.provider === 'stripe' || formData.provider === 'paystack') {
      if (!formData.configuration.publicKey) {
        newErrors.publicKey = 'Public key is required'
      }
      if (!formData.configuration.secretKey) {
        newErrors.secretKey = 'Secret key is required'
      }
    }

    if (formData.provider === 'flutterwave') {
      if (!formData.configuration.publicKey) {
        newErrors.publicKey = 'Public key is required'
      }
      if (!formData.configuration.secretKey) {
        newErrors.secretKey = 'Secret key is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSave(formData)
    onClose()
  }

  const handleTestConnection = async () => {
    if (!formData.configuration.publicKey || !formData.configuration.secretKey) {
      setErrors({ testConnection: 'Public and Secret keys are required for testing' })
      return
    }

    setIsTestingConnection(true)

    // Simulate API test call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // In real implementation, make actual API call to test connection
      setErrors({ testConnection: '' })
      alert('Connection test successful!')
    } catch (error) {
      setErrors({ testConnection: 'Connection test failed. Please check your credentials.' })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const addCountry = (countryCode: string) => {
    if (!formData.countries.includes(countryCode)) {
      setFormData((prev) => ({
        ...prev,
        countries: [...prev.countries, countryCode],
      }))
    }
  }

  const removeCountry = (countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      countries: prev.countries.filter((c) => c !== countryCode),
    }))
  }

  const addCurrency = (currency: string) => {
    if (!formData.supportedCurrencies.includes(currency)) {
      setFormData((prev) => ({
        ...prev,
        supportedCurrencies: [...prev.supportedCurrencies, currency],
      }))
    }
  }

  const removeCurrency = (currency: string) => {
    setFormData((prev) => ({
      ...prev,
      supportedCurrencies: prev.supportedCurrencies.filter((c) => c !== currency),
    }))
  }

  const getCountryName = (code: string) => {
    return countries.find((country) => country.code === code)?.name || code
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Payment Method' : 'Edit Payment Method'}</DialogTitle>
          <DialogDescription>
            Configure payment method settings and assign to countries.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Payment Method Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Flutterwave Nigeria"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider *</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, provider: value as PaymentMethod['provider'] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provider && <p className="text-sm text-red-500">{errors.provider}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Payment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value as PaymentMethod['type'] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as PaymentMethod['status'] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publicKey">Public Key</Label>
                <Input
                  id="publicKey"
                  value={formData.configuration.publicKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuration: { ...prev.configuration, publicKey: e.target.value },
                    }))
                  }
                  placeholder="Enter public key"
                />
                {errors.publicKey && <p className="text-sm text-red-500">{errors.publicKey}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? 'text' : 'password'}
                    value={formData.configuration.secretKey}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        configuration: { ...prev.configuration, secretKey: e.target.value },
                      }))
                    }
                    placeholder="Enter secret key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.secretKey && <p className="text-sm text-red-500">{errors.secretKey}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchantId">Merchant ID</Label>
                <Input
                  id="merchantId"
                  value={formData.configuration.merchantId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuration: { ...prev.configuration, merchantId: e.target.value },
                    }))
                  }
                  placeholder="Enter merchant ID (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={formData.configuration.webhookUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      configuration: { ...prev.configuration, webhookUrl: e.target.value },
                    }))
                  }
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="testMode"
                checked={formData.configuration.testMode}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    configuration: { ...prev.configuration, testMode: checked },
                  }))
                }
              />
              <Label htmlFor="testMode">Test Mode</Label>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
            {errors.testConnection && (
              <p className="text-sm text-red-500">{errors.testConnection}</p>
            )}
          </div>

          {/* Countries */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Supported Countries *</h3>
            <CountrySelector onValueChange={addCountry} placeholder="Select countries..." />
            {formData.countries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.countries.map((countryCode) => (
                  <Badge key={countryCode} variant="secondary" className="flex items-center gap-1">
                    {getCountryName(countryCode)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCountry(countryCode)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            {errors.countries && <p className="text-sm text-red-500">{errors.countries}</p>}
          </div>

          {/* Currencies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Supported Currencies *</h3>
            <Select onValueChange={addCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Add currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.filter(
                  (currency) => !formData.supportedCurrencies.includes(currency)
                ).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.supportedCurrencies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.supportedCurrencies.map((currency) => (
                  <Badge key={currency} variant="secondary" className="flex items-center gap-1">
                    {currency}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCurrency(currency)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            {errors.supportedCurrencies && (
              <p className="text-sm text-red-500">{errors.supportedCurrencies}</p>
            )}
          </div>

          {/* Transaction Fee */}
          <div className="space-y-2">
            <Label htmlFor="transactionFee">Transaction Fee (%)</Label>
            <Input
              id="transactionFee"
              type="number"
              step="0.1"
              min="0"
              value={formData.transactionFee}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  transactionFee: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="e.g., 2.9"
            />
            {errors.transactionFee && (
              <p className="text-sm text-red-500">{errors.transactionFee}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'add' ? 'Add Payment Method' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
