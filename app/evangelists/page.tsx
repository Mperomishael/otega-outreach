import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Our Evangelist - Otega Evangelical Outreach",
  description:
    "Meet Evangelist Otega Eugene, bringing Holy Spirit-powered outreach to rural Nigeria through Biblical discipleship and salvation crusades.",
}

export default function EvangelistsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Our Evangelist</h1>
      <p className="text-center text-gray-700 mb-8">Meet the founder and leader of Otega Evangelical Outreach</p>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3">
            <div className="relative h-64 md:h-full w-full">
              <Image
                src="https://i.ibb.co/N2dpNgsL/photo-6021658356923614950-y.jpg"
                alt="Evangelist Otega Eugene, founder of Otega Evangelical Outreach"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2">Evangelist Otega Eugene</h2>
            <p className="text-amber-800 font-medium mb-4">Founder & Lead Evangelist</p>

            <div className="space-y-4">
              <p>
                Evangelist Otega Eugene has dedicated his life to bringing Holy Spirit-powered outreach to the most
                remote villages across Nigeria. With a passion for Biblical discipleship and a heart for the rural
                church, he has led salvation crusades in all 36 Nigerian states.
              </p>

              <p>
                After receiving his calling in 2015, Evangelist Otega founded the Otega Evangelical Outreach with a
                vision to raise Kingdom leaders in Nigeria's villages. His ministry focuses on equipping rural pastors
                with the tools they need to create spiritual transformation in their communities.
              </p>

              <p>
                Through his leadership, over 500 pastors have been trained in Biblical discipleship methods, and more
                than 100 villages have experienced revival. Evangelist Otega continues to travel throughout Nigeria,
                bringing the message of salvation and empowerment to rural churches.
              </p>

              <blockquote className="italic border-l-4 border-amber-800 pl-4">
                "My vision is to see every village in Nigeria transformed by the power of the Gospel, with indigenous
                leaders equipped to sustain spiritual growth for generations to come."
              </blockquote>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-2">Areas of Ministry:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Rural Church Empowerment</li>
                <li>Salvation Crusades</li>
                <li>Biblical Discipleship Training</li>
                <li>Leadership Development</li>
                <li>Community Transformation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
