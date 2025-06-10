'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'

const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  durations: z.object({
    twoWeeks: z.object({
      price: z.number().min(0, 'Price must be positive'),
      enabled: z.boolean()
    }),
    oneMonth: z.object({
      price: z.number().min(0, 'Price must be positive'),
      enabled: z.boolean()
    }),
    threeMonths: z.object({
      price: z.number().min(0, 'Price must be positive'),
      enabled: z.boolean()
    }),
    sixMonths: z.object({
      price: z.number().min(0, 'Price must be positive'),
      enabled: z.boolean()
    })
  }),
  countries: z.array(z.string()),
  status: z.enum(['active', 'inactive'])
})

type PackageFormValues = z.infer<typeof packageSchema>

const AVAILABLE_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' }
]

interface PackageFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PackageFormValues) => void
  initialData?: PackageFormValues | null
}

export function PackageFormDialog({
  isOpen,
  onClose,
  onSave,
  initialData
}: PackageFormDialogProps) {
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      description: '',
      durations: {
        twoWeeks: { price: 0, enabled: true },
        oneMonth: { price: 0, enabled: true },
        threeMonths: { price: 0, enabled: true },
        sixMonths: { price: 0, enabled: true }
      },
      countries: [],
      status: 'active'
    }
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else {
      form.reset({
        name: '',
        description: '',
        durations: {
          twoWeeks: { price: 0, enabled: true },
          oneMonth: { price: 0, enabled: true },
          threeMonths: { price: 0, enabled: true },
          sixMonths: { price: 0, enabled: true }
        },
        countries: [],
        status: 'active'
      })
    }
  }, [initialData, form])

  const onSubmit = (data: PackageFormValues) => {
    onSave(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Package' : 'Create Package'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the package details below.'
              : 'Fill in the details to create a new package.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter package description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Durations & Pricing</h3>
              {(['twoWeeks', 'oneMonth', 'threeMonths', 'sixMonths'] as const).map((duration) => (
                <div key={duration} className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name={`durations.${duration}.enabled`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          {duration === 'twoWeeks'
                            ? '2 Weeks'
                            : duration === 'oneMonth'
                            ? '1 Month'
                            : duration === 'threeMonths'
                            ? '3 Months'
                            : '6 Months'}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`durations.${duration}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Price"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            disabled={!form.watch(`durations.${duration}.enabled`)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Availability</h3>
              <FormField
                control={form.control}
                name="countries"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Countries</FormLabel>
                      <FormDescription>
                        Select the countries where this package will be available. Leave empty for global availability.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {AVAILABLE_COUNTRIES.map((country) => (
                        <FormField
                          key={country.code}
                          control={form.control}
                          name="countries"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={country.code}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(country.code)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, country.code])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== country.code
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {country.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === 'active'}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? 'active' : 'inactive')
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value === 'active'
                        ? 'Package is currently active and available for purchase.'
                        : 'Package is inactive and not available for purchase.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Update Package' : 'Create Package'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
