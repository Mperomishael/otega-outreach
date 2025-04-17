import Link from "next/link"
import { CheckCircle, ArrowLeft, Heart } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Thank You for Your Support!</h1>

        <p className="text-lg text-gray-700 mb-6">
          Your generous contribution to Otega Evangelical Outreach will help us continue our mission of spreading the
          Gospel and transforming lives across Nigeria.
        </p>

        <div className="bg-amber-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center justify-center">
            <Heart className="text-amber-800 mr-2" /> What Your Support Enables:
          </h2>
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <span className="text-amber-800 mr-2">•</span>
              <span>Salvation crusades in unreached villages</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-800 mr-2">•</span>
              <span>Training for local pastors and evangelists</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-800 mr-2">•</span>
              <span>Providing Bibles and Christian literature</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-800 mr-2">•</span>
              <span>Supporting outreach programs in rural communities</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-700 mb-8">
          We've sent a confirmation email with details of your donation. If you have any questions, please don't
          hesitate to contact us.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="mr-2" size={18} />
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 border border-amber-800 text-amber-800 rounded-md hover:bg-amber-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
