"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Terms and Conditions</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using Legit Soccer Tips, you agree to be bound by these Terms and Conditions and all applicable 
              laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Legit Soccer Tips's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            
            <h2>3. Subscription Terms</h2>
            <p>
            Legit Soccer Tips offers various subscription plans for premium content and predictions. By subscribing to our services:
            </p>
            <ul>
              <li>You agree to pay the subscription fees as described at the time of purchase</li>
              <li>Subscriptions automatically renew unless canceled before the renewal date</li>
              <li>You can cancel your subscription at any time through your account settings</li>
              <li>No refunds will be provided for partial subscription periods</li>
            </ul>
            
            <h2>4. Disclaimer</h2>
            <p>
              The materials on Legit Soccer Tips's website are provided on an &apos;as is&apos; basis. Legit Soccer Tips makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property or other violation of rights.
            </p>
            <p>
              Further, Legit Soccer Tips does not warrant or make any representations concerning the accuracy, likely results, 
              or reliability of the use of the materials on its website or otherwise relating to such materials or on any 
              sites linked to this site.
            </p>
            
            <h2>5. Predictions and Betting Advice</h2>
            <p>
              All predictions and betting tips provided on Legit Soccer Tips are for informational purposes only. We do not 
              guarantee the accuracy of any predictions, and we are not responsible for any financial losses incurred 
              from following our advice. Betting involves risk, and you should only bet what you can afford to lose.
            </p>
            
            <h2>6. Limitations</h2>
            <p>
              In no event shall Legit Soccer Tips or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on Legit Soccer Tips's website, even if Legit Soccer Tips or a Legit Soccer Tips authorized representative 
              has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h2>7. Revisions and Errata</h2>
            <p>
              The materials appearing on Legit Soccer Tips's website could include technical, typographical, or photographic errors. 
              Legit Soccer Tips does not warrant that any of the materials on its website are accurate, complete or current. 
              Legit Soccer Tips may make changes to the materials contained on its website at any time without notice.
            </p>
            
            <h2>8. Links</h2>
            <p>
            Legit Soccer Tips has not reviewed all of the sites linked to its website and is not responsible for the contents 
              of any such linked site. The inclusion of any link does not imply endorsement by Legit Soccer Tips of the site. 
              Use of any such linked website is at the user's own risk.
            </p>
            
            <h2>9. Modifications to Terms</h2>
            <p>
            Legit Soccer Tips may revise these terms of service for its website at any time without notice. By using this 
              website you are agreeing to be bound by the then current version of these terms of service.
            </p>
            
            <h2>10. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
              submit to the exclusive jurisdiction of the courts in that location.
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