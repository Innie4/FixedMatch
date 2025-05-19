"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <h2>1. Introduction</h2>
            <p>
              At Fixed Match Pro, we respect your privacy and are committed to protecting your personal data. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not 
              access the Service.
            </p>
            
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Data</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register on the website, 
              express interest in obtaining information about us or our products and Services, or otherwise contact us.
              The personal information we collect may include:
            </p>
            <ul>
              <li>Name and contact data (email address, phone number)</li>
              <li>Credentials (password and similar security information)</li>
              <li>Payment data (credit card details, billing address)</li>
              <li>Profile data (username, profile picture)</li>
            </ul>
            
            <h3>2.2 Usage Data</h3>
            <p>
              We automatically collect certain information when you visit, use or navigate our website. This information 
              does not reveal your specific identity but may include:
            </p>
            <ul>
              <li>Device and connection information (IP address, browser type, operating system)</li>
              <li>Usage patterns (pages visited, time spent on pages, click-through data)</li>
              <li>Location data (general geographic location based on IP address)</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Provide, operate, and maintain our website and services</li>
              <li>Process and complete transactions, and send related information</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to inquiries and offer support</li>
              <li>Improve and personalize your experience on our website</li>
              <li>Monitor usage patterns for research and analytics</li>
            </ul>
            
            <h2>4. Disclosure of Your Information</h2>
            <p>We may share your information in the following situations:</p>
            <ul>
              <li>With service providers who perform services for us</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2>5. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the 
              security of any personal information we process. However, please also remember that we cannot guarantee 
              that the internet itself is 100% secure.
            </p>
            
            <h2>6. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>The right to access information we hold about you</li>
              <li>The right to request correction of your personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to withdraw consent</li>
              <li>The right to object to processing of your personal information</li>
            </ul>
            
            <h2>7. Cookies Policy</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@fixedmatchpro.com
              <br />
              Address: 123 Prediction Street, Sports City, SC 12345
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}