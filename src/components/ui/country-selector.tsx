'use client'

import * as React from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { countries, type Country } from '@/lib/countries'

interface CountrySelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CountrySelector({
  value,
  onValueChange,
  placeholder = 'Select country...',
  disabled = false,
  className,
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  const selectedCountry = countries.find((country) => country.code === value)

  const filteredCountries = React.useMemo(() => {
    if (!searchValue) return countries

    const lowercaseSearch = searchValue.toLowerCase()
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(lowercaseSearch) ||
        country.code.toLowerCase().includes(lowercaseSearch)
    )
  }, [searchValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-10 px-3 py-2 text-sm',
            !selectedCountry && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="truncate">{selectedCountry.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search countries..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <CommandList className="max-h-[200px] overflow-auto">
            {filteredCountries.length === 0 ? (
              <CommandEmpty>No country found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredCountries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.code}
                    onSelect={() => {
                      onValueChange?.(country.code)
                      setOpen(false)
                      setSearchValue('')
                    }}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedCountry?.code === country.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
