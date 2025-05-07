"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface BettingOddsProps {
  homeTeam: string
  awayTeam: string
}

export default function BettingOdds({ homeTeam, awayTeam }: BettingOddsProps) {
  const [selectedOdds, setSelectedOdds] = useState<Record<string, string>>({})

  // Example betting odds - in a real app, this would be fetched from an API
  const matchResultOdds = [
    { name: `${homeTeam} (1)`, value: "1.85", type: "match-result" },
    { name: "Draw (X)", value: "3.60", type: "match-result" },
    { name: `${awayTeam} (2)`, value: "4.50", type: "match-result" },
  ]

  const doubleChanceOdds = [
    { name: `${homeTeam} or Draw (1X)`, value: "1.24", type: "double-chance" },
    { name: `${homeTeam} or ${awayTeam} (12)`, value: "1.36", type: "double-chance" },
    { name: `${awayTeam} or Draw (X2)`, value: "1.95", type: "double-chance" },
  ]

  const overUnderOdds = [
    { name: "Over 0.5 Goals", value: "1.05", type: "over-under" },
    { name: "Under 0.5 Goals", value: "12.00", type: "over-under" },
    { name: "Over 1.5 Goals", value: "1.25", type: "over-under" },
    { name: "Under 1.5 Goals", value: "4.00", type: "over-under" },
    { name: "Over 2.5 Goals", value: "1.85", type: "over-under" },
    { name: "Under 2.5 Goals", value: "1.95", type: "over-under" },
    { name: "Over 3.5 Goals", value: "3.10", type: "over-under" },
    { name: "Under 3.5 Goals", value: "1.36", type: "over-under" },
  ]

  const bothTeamsToScoreOdds = [
    { name: "Yes", value: "1.85", type: "btts" },
    { name: "No", value: "1.95", type: "btts" },
  ]

  const selectOdd = (type: string, name: string, value: string) => {
    setSelectedOdds((prev) => ({
      ...prev,
      [type]: `${name} @ ${value}`,
    }))
  }

  const isSelected = (type: string, name: string) => {
    return selectedOdds[type]?.startsWith(name)
  }

  return (
    <div>
      <Tabs defaultValue="match-result">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="match-result">Match Result</TabsTrigger>
          <TabsTrigger value="double-chance">Double Chance</TabsTrigger>
          <TabsTrigger value="over-under">Over/Under</TabsTrigger>
          <TabsTrigger value="btts">Both Teams to Score</TabsTrigger>
        </TabsList>
        
        <TabsContent value="match-result" className="mt-0">
          <div className="grid grid-cols-3 gap-3">
            {matchResultOdds.map((odd) => (
              <Button
                key={odd.name}
                variant="outline"
                className={cn(
                  "flex flex-col h-auto py-3",
                  isSelected(odd.type, odd.name) && "border-[#1a56db] bg-[#1a56db]/5 text-[#1a56db]"
                )}
                onClick={() => selectOdd(odd.type, odd.name, odd.value)}
              >
                <span className="text-sm font-normal">{odd.name}</span>
                <span className="text-lg font-bold">{odd.value}</span>
                {isSelected(odd.type, odd.name) && (
                  <CheckCircle className="h-4 w-4 absolute top-2 right-2 text-[#1a56db]" />
                )}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="double-chance" className="mt-0">
          <div className="grid grid-cols-3 gap-3">
            {doubleChanceOdds.map((odd) => (
              <Button
                key={odd.name}
                variant="outline"
                className={cn(
                  "flex flex-col h-auto py-3",
                  isSelected(odd.type, odd.name) && "border-[#1a56db] bg-[#1a56db]/5 text-[#1a56db]"
                )}
                onClick={() => selectOdd(odd.type, odd.name, odd.value)}
              >
                <span className="text-sm font-normal">{odd.name}</span>
                <span className="text-lg font-bold">{odd.value}</span>
                {isSelected(odd.type, odd.name) && (
                  <CheckCircle className="h-4 w-4 absolute top-2 right-2 text-[#1a56db]" />
                )}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="over-under" className="mt-0">
          <div className="grid grid-cols-4 gap-3">
            {overUnderOdds.map((odd) => (
              <Button
                key={odd.name}
                variant="outline"
                className={cn(
                  "flex flex-col h-auto py-3",
                  isSelected(odd.type, odd.name) && "border-[#1a56db] bg-[#1a56db]/5 text-[#1a56db]"
                )}
                onClick={() => selectOdd(odd.type, odd.name, odd.value)}
              >
                <span className="text-sm font-normal">{odd.name}</span>
                <span className="text-lg font-bold">{odd.value}</span>
                {isSelected(odd.type, odd.name) && (
                  <CheckCircle className="h-4 w-4 absolute top-2 right-2 text-[#1a56db]" />
                )}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="btts" className="mt-0">
          <div className="grid grid-cols-2 gap-3">
            {bothTeamsToScoreOdds.map((odd) => (
              <Button
                key={odd.name}
                variant="outline"
                className={cn(
                  "flex flex-col h-auto py-3",
                  isSelected(odd.type, odd.name) && "border-[#1a56db] bg-[#1a56db]/5 text-[#1a56db]"
                )}
                onClick={() => selectOdd(odd.type, odd.name, odd.value)}
              >
                <span className="text-sm font-normal">BTTS: {odd.name}</span>
                <span className="text-lg font-bold">{odd.value}</span>
                {isSelected(odd.type, odd.name) && (
                  <CheckCircle className="h-4 w-4 absolute top-2 right-2 text-[#1a56db]" />
                )}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 space-y-4">
        <h4 className="text-base font-medium text-gray-900 dark:text-white">Your Selections</h4>
        
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          {Object.keys(selectedOdds).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(selectedOdds).map(([type, selection]) => (
                <li key={type} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {type === "match-result"
                      ? "Match Result"
                      : type === "double-chance"
                        ? "Double Chance"
                        : type === "over-under"
                          ? "Over/Under"
                          : "Both Teams to Score"}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{selection}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">No selections yet</p>
          )}
        </div>
        {Object.keys(selectedOdds).length > 0 && <Button className="w-full bg-[#1a56db] hover:bg-[#1e40af]">Place Bet</Button>}
      </div>
    </div>
  )
}
