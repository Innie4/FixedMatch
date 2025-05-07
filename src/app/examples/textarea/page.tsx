"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label" // Add this import

export default function TextareaExamplePage() {
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters long")
      return
    }

    setError(null)
    setFeedback("Message submitted successfully!")
    // In a real app, you would send the message to your API here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Textarea Component Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Textarea</CardTitle>
            <CardDescription>A simple textarea component with various states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Default Textarea" htmlFor="default-textarea">
              <Textarea id="default-textarea" placeholder="Type your message here" />
            </FormField>

            <FormField label="Disabled Textarea" htmlFor="disabled-textarea">
              <Textarea id="disabled-textarea" placeholder="This textarea is disabled" disabled />
            </FormField>

            <FormField label="Textarea with Error" htmlFor="error-textarea" error="This field is required">
              <Textarea id="error-textarea" placeholder="Type your message here" error={true} />
            </FormField>

            <FormField label="Textarea with Rows" htmlFor="rows-textarea">
              <Textarea id="rows-textarea" placeholder="This textarea has 5 rows" rows={5} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Form Example</CardTitle>
            <CardDescription>A practical example of the textarea in a form</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FormField
                label="Your Message"
                htmlFor="message-textarea"
                error={error || undefined}
                description="Please provide as much detail as possible"
              >
                <Textarea
                  id="message-textarea"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  error={!!error}
                />
              </FormField>

              {feedback && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-md text-sm">
                  {feedback}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setMessage("")}>
              Clear
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Textarea with Character Count</CardTitle>
            <CardDescription>A textarea that shows the remaining character count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="character-count-textarea">Your Bio</Label>
              <Textarea
                id="character-count-textarea"
                placeholder="Tell us about yourself..."
                maxLength={200}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 text-right">{message.length}/200 characters</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Remove these functions as they're no longer needed
// function Label({ htmlFor, children, className }: { htmlFor: string; children: React.ReactNode; className?: string }) {
//   return (
//     <label htmlFor={htmlFor} className={cn("text-sm font-medium text-gray-900 dark:text-white", className)}>
//       {children}
//     </label>
//   )
// }

// function cn(...classes: (string | boolean | undefined)[]) {
//   return classes.filter(Boolean).join(" ")
// }
