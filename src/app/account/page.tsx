"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Mail, 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Star, 
  Settings, 
  LogOut,
  Check // Added the missing Check icon import
} from "lucide-react"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("subscription")
  
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
    subscription: {
      plan: "Monthly Premium",
      status: "active",
      startDate: "2023-10-15",
      endDate: "2023-11-15",
      daysLeft: 12,
      autoRenew: true,
      price: 29.99,
    },
    history: [
      {
        id: "sub_123456",
        plan: "Monthly Premium",
        amount: 29.99,
        date: "2023-10-15",
        status: "paid",
      },
      {
        id: "sub_123455",
        plan: "Weekly Pass",
        amount: 9.99,
        date: "2023-10-01",
        status: "paid",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Image
                src={user.avatar}
                alt={user.name}
                width={96}
                height={96}
                className="rounded-full mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
              
              {user.subscription.status === "active" && (
                <div className="mt-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                  VIP Member
                </div>
              )}
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("subscription")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                  activeTab === "subscription"
                    ? "bg-[#1a56db] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Subscription
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                  activeTab === "history"
                    ? "bg-[#1a56db] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Clock className="h-4 w-4" />
                Payment History
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                  activeTab === "settings"
                    ? "bg-[#1a56db] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                  activeTab === "review"
                    ? "bg-[#1a56db] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Star className="h-4 w-4" />
                Leave a Review
              </button>
              <Link
                href="/auth/logout"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Subscription Tab */}
            {activeTab === "subscription" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subscription Status</h3>
                
                {user.subscription.status === "active" ? (
                  <>
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{user.subscription.plan}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Renews on {user.subscription.endDate}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Subscription period</span>
                          <span className="text-gray-900 dark:text-white">
                            {user.subscription.startDate} - {user.subscription.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Amount</span>
                          <span className="text-gray-900 dark:text-white">${user.subscription.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Auto-renew</span>
                          <span className="text-gray-900 dark:text-white">
                            {user.subscription.autoRenew ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </div>
                      
                      {user.subscription.daysLeft <= 3 && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-md mb-4">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Your subscription is about to expire</p>
                            <p className="text-sm">
                              Your subscription will expire in {user.subscription.daysLeft} days. Renew now to avoid
                              losing access to VIP predictions.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Renew Subscription</Button>
                        <Button variant="outline">Change Plan</Button>
                        <Button variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">VIP Benefits</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Check className="h-5 w-5 text-green-500" />
                          Access to all premium predictions
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Check className="h-5 w-5 text-green-500" />
                          Detailed match analysis and statistics
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Check className="h-5 w-5 text-green-500" />
                          Early access to predictions (24h before public)
                        </li>
                        <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Check className="h-5 w-5 text-green-500" />
                          Email notifications for high-confidence picks
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                      <CreditCard className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No active subscription
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      You don't have an active subscription. Upgrade to VIP to get access to premium predictions and
                      features.
                    </p>
                    <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
                      <Link href="/vip">View VIP Plans</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === "history" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment History</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                        <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                        <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Plan</th>
                        <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                        <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {user.history.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{payment.date}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{payment.plan}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">${payment.amount}</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm" className="text-[#1a56db]">
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {user.history.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No payment history found
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Personal Information</h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            placeholder="Your name"
                            className="pl-10"
                            defaultValue={user.name}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            className="pl-10"
                            defaultValue={user.email}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Email Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="email-predictions"
                          className="h-4 w-4 rounded border-gray-300 text-[#1a56db] focus:ring-[#1a56db]"
                          defaultChecked
                        />
                        <label htmlFor="email-predictions" className="text-sm text-gray-700 dark:text-gray-300">
                          Receive prediction notifications
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="email-newsletter"
                          className="h-4 w-4 rounded border-gray-300 text-[#1a56db] focus:ring-[#1a56db]"
                          defaultChecked
                        />
                        <label htmlFor="email-newsletter" className="text-sm text-gray-700 dark:text-gray-300">
                          Receive weekly newsletter
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Save Changes</Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Review Tab */}
            {activeTab === "review" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Leave a Review</h3>
                
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="review" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Review
                    </label>
                    <Textarea
                      id="review"
                      placeholder="Tell us about your experience with our predictions..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="text-yellow-400 hover:text-yellow-500"
                        >
                          <Star className="h-6 w-6" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Submit Review</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}