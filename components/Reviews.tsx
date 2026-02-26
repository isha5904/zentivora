import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Jennifer M.',
    emoji: '👩',
    rating: 5,
    pet: 'Golden Retriever - Buddy',
    review: 'Sarah did an absolutely amazing job with Buddy! He came back looking like a show dog. The online booking was so easy and the appointment reminder was helpful. Will definitely be back!',
    date: '2 weeks ago',
  },
  {
    name: 'Robert K.',
    emoji: '👨',
    rating: 5,
    pet: 'Standard Poodle - Luna',
    review: 'Mike was incredibly patient with our anxious poodle Luna. She usually hates grooming but came back so calm and happy. The price was very reasonable for the quality of service.',
    date: '1 month ago',
  },
  {
    name: 'Priya S.',
    emoji: '🧕',
    rating: 5,
    pet: 'Shih Tzu - Coco',
    review: 'Emma\'s creative cut on Coco was beyond what I expected! The whole experience from booking online to pickup was seamless. The dashboard feature to track the appointment is genius!',
    date: '3 weeks ago',
  },
  {
    name: 'Marcus T.',
    emoji: '🧔',
    rating: 5,
    pet: 'Great Dane - Zeus',
    review: 'Finding a groomer for Zeus (175lbs Great Dane) was always a nightmare. David handled him like a pro! The facility was spotless and Zeus was treated like royalty.',
    date: '1 week ago',
  },
  {
    name: 'Lisa H.',
    emoji: '👱‍♀️',
    rating: 5,
    pet: 'Cockapoo - Pretzel',
    review: 'This is our third visit and every time Pretzel comes home looking incredible. The staff is friendly, professional, and truly passionate about what they do. Highly recommend!',
    date: '5 days ago',
  },
  {
    name: 'James O.',
    emoji: '👴',
    rating: 4,
    pet: 'Beagle - Charlie',
    review: 'Great service overall. Charlie\'s first groom went so smoothly — the puppy package was perfect for him. Only small feedback: would love more time slots on weekends.',
    date: '2 months ago',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            What Pet Parents Say
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">4.9</span>
            <span className="text-gray-500">from 1,200+ reviews</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-orange-100">
                <Quote className="w-10 h-10 fill-orange-100" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5 relative z-10">
                &quot;{review.review}&quot;
              </p>

              {/* Reviewer info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-xl">
                  {review.emoji}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-orange-600">🐾 {review.pet}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
