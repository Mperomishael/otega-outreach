import Image from "next/image"
import Link from "next/link"

export default function FeaturedEvangelists() {
  const evangelists = [
    {
      id: 1,
      name: "Pastor Emmanuel Adeyemi",
      region: "Lagos & Southwest",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Evangelist Chioma Okonkwo",
      region: "Enugu & Southeast",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Pastor Ibrahim Musa",
      region: "Jos & North Central",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Evangelist Grace Obasanjo",
      region: "Abuja & FCT",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="text-2xl font-bold text-center">Our Evangelists</h2>
        <p className="text-center text-gray-700">Meet Our Anointed Servants: From Lagos to Jos, Abuja to Enugu</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {evangelists.map((evangelist) => (
          <div key={evangelist.id} className="text-center">
            <div className="relative h-32 w-32 md:h-40 md:w-40 mx-auto mb-3 rounded-full overflow-hidden">
              <Image
                src={evangelist.image || "/placeholder.svg"}
                alt={`Otega Outreach evangelist ${evangelist.name} serving in ${evangelist.region}`}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold">{evangelist.name}</h3>
            <p className="text-sm text-amber-700">{evangelist.region}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/evangelists" className="inline-flex items-center text-amber-700 hover:text-amber-800">
          View All Evangelists →
        </Link>
      </div>
    </section>
  )
}
