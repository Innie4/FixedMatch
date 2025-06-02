import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#1a56db] text-white font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center">
                FP
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Legit Soccer Tips</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Expert football predictions and live scores for all major leagues worldwide.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-[#1a56db] dark:text-gray-400 dark:hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-[#1a56db] dark:text-gray-400 dark:hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-[#1a56db] dark:text-gray-400 dark:hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-[#1a56db] dark:text-gray-400 dark:hover:text-white">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/predictions"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white"
                >
                  Predictions
                </Link>
              </li>
              <li>
                <Link
                  href="/live-scores"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white"
                >
                  Live Scores
                </Link>
              </li>
              <li>
                <Link
                  href="/leagues"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white"
                >
                  Leagues
                </Link>
              </li>
              <li>
                <Link
                  href="/vip"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white"
                >
                  VIP Access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@footballpredict.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
                />
                <button className="bg-[#1a56db] hover:bg-[#1e40af] text-white px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} FootballPredict. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-gray-600 dark:text-gray-400 hover:text-[#1a56db] dark:hover:text-white text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
