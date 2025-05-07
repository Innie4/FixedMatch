"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  CheckCircle
} from "lucide-react"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Please fill in all required fields")
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, let's simulate a successful submission
      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Get in Touch</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Have questions about our predictions, subscription plans, or need technical support? 
              Our team is here to help you. Reach out to us using any of the methods below.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#1a56db]/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-[#1a56db]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Email Us</h3>
                  <p className="text-gray-700 dark:text-gray-300">support@predictspro.com</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#1a56db]/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-[#1a56db]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Call Us</h3>
                  <p className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mon-Fri, 9AM-5PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#1a56db]/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-[#1a56db]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Office Location</h3>
                  <p className="text-gray-700 dark:text-gray-300">123 Prediction Street</p>
                  <p className="text-gray-700 dark:text-gray-300">New York, NY 10001</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Image src="/placeholder.svg?height=24&width=24" alt="Twitter" width={24} height={24} />
                </a>
                <a href="#" className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Image src="/placeholder.svg?height=24&width=24" alt="Facebook" width={24} height={24} />
                </a>
                <a href="#" className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Image src="/placeholder.svg?height=24&width=24" alt="Instagram" width={24} height={24} />
                </a>
                <a href="#" className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Image src="/placeholder.svg?height=24&width=24" alt="LinkedIn" width={24} height={24} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send Us a Message</h2>
            
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/20 p-4 rounded-full mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button 
                  onClick={() => setSuccess(false)} 
                  className="bg-[#1a56db] hover:bg-[#1e40af]"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={5}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#1a56db] hover:bg-[#1e40af] flex items-center justify-center gap-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How accurate are your predictions?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our predictions have an average accuracy of 78% across all leagues. We continuously refine our models to improve accuracy.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How often are predictions updated?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Predictions are updated in real-time as new data becomes available. We factor in team news, injuries, and other relevant information.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Can I get a refund if I'm not satisfied?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, we offer a 7-day money-back guarantee for all new subscribers. If you're not satisfied with our service, contact our support team.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Which leagues do you cover?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We cover over 30 leagues worldwide, including all major European leagues, South American competitions, and selected leagues from Africa, Asia, and North America.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}