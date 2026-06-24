import CircularLoader from "@/components/ui/circular-loader"

export default function AdminLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <CircularLoader size="lg" color="amber" label="Loading Admin Panel..." />
    </div>
  )
}
