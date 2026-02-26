export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      emoji: '📝',
      title: 'Create Your Account',
      description: 'Sign up for free and create your profile. Add your pet\'s details like breed, age, and any special requirements.',
    },
    {
      step: '02',
      emoji: '✂️',
      title: 'Choose a Service',
      description: 'Browse our grooming packages and select the one that best suits your dog\'s needs and your budget.',
    },
    {
      step: '03',
      emoji: '📅',
      title: 'Pick Date & Time',
      description: 'Select a convenient time slot from our available schedule. Same-day and next-day bookings available.',
    },
    {
      step: '04',
      emoji: '🧑‍🔧',
      title: 'Choose Your Groomer',
      description: 'Pick from our certified groomers based on their specialties, ratings, and availability.',
    },
    {
      step: '05',
      emoji: '✅',
      title: 'Confirm Booking',
      description: 'Review your appointment details and confirm. You\'ll receive an instant confirmation email.',
    },
    {
      step: '06',
      emoji: '🐾',
      title: 'Happy Pet!',
      description: 'Bring your pup in and let our experts do the rest. Track status in your dashboard.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            How Zentivora Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Book a grooming appointment in under 3 minutes. It&apos;s that simple!
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Step number watermark */}
              <div className="absolute -top-3 -right-3 text-8xl font-black text-orange-50 group-hover:text-orange-100 transition-colors select-none">
                {item.step}
              </div>

              <div className="relative z-10">
                {/* Step badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {item.step}
                  </div>
                  <span className="text-3xl">{item.emoji}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>

              {/* Connector arrow (not on last items) */}
              {i < steps.length - 1 && i % 3 !== 2 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xs font-bold">
                    →
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
