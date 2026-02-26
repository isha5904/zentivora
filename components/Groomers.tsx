import { Star, Award } from 'lucide-react'

const groomers = [
  {
    name: 'Sarah Johnson',
    emoji: '👩',
    experience: '8 years',
    rating: 4.9,
    reviews: 312,
    speciality: 'Poodles & Doodles',
    badges: ['Certified Master', 'Award Winner'],
    bio: 'Certified master groomer with a passion for all breeds. Sarah specializes in doodle and poodle cuts.',
  },
  {
    name: 'Mike Chen',
    emoji: '👨',
    experience: '5 years',
    rating: 4.8,
    reviews: 198,
    speciality: 'Anxious & Senior Dogs',
    badges: ['Gentle Specialist', 'Vet Tech'],
    bio: 'Former vet technician turned groomer. Known for being extra gentle with anxious and senior pets.',
  },
  {
    name: 'Emma Rodriguez',
    emoji: '👩‍🦱',
    experience: '10 years',
    rating: 4.9,
    reviews: 427,
    speciality: 'Creative Styling',
    badges: ['Asian Fusion', '2x Champion'],
    bio: 'Award-winning groomer specializing in Asian fusion styling and creative artistic cuts.',
  },
  {
    name: 'David Kim',
    emoji: '🧑',
    experience: '7 years',
    rating: 4.7,
    reviews: 264,
    speciality: 'Large Breeds',
    badges: ['Large Breed Expert', 'Certified'],
    bio: 'Expert in large breed grooming including Newfoundlands, St. Bernards, and Great Danes.',
  },
]

export default function Groomers() {
  return (
    <section id="groomers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Meet Our Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Expert Groomers You Can Trust
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            All our groomers are certified, background-verified, and have minimum 5 years of professional experience.
          </p>
        </div>

        {/* Groomers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groomers.map((groomer, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                {groomer.emoji}
              </div>

              {/* Name & Rating */}
              <h3 className="font-bold text-gray-900 text-lg">{groomer.name}</h3>
              <div className="flex items-center justify-center gap-1.5 my-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-700 text-sm">{groomer.rating}</span>
                <span className="text-gray-400 text-sm">({groomer.reviews})</span>
              </div>

              {/* Speciality */}
              <div className="flex items-center justify-center gap-1 text-orange-600 text-sm font-medium mb-3">
                <Award className="w-3.5 h-3.5" />
                {groomer.speciality}
              </div>

              {/* Experience */}
              <div className="text-xs text-gray-500 mb-3">
                Experience: <span className="font-semibold text-gray-700">{groomer.experience}</span>
              </div>

              {/* Bio */}
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{groomer.bio}</p>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {groomer.badges.map((badge, j) => (
                  <span key={j} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Book Button */}
              <a
                href="#services"
                className="block w-full py-2 border-2 border-orange-500 text-orange-500 text-sm font-semibold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-200"
              >
                Book with {groomer.name.split(' ')[0]}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
