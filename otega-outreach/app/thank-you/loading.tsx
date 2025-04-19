import CircularLoader from "@/components/ui/circular-loader"

export default function ThankYouLoading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CircularLoader size="lg" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Processing your donation...</h2>
        <p className="text-gray-600 mt-2">Please wait while we confirm your payment.</p>
      </div>
    </div>
  )
}
