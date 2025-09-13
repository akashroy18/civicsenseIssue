import React from 'react';

const features = [
  {
    title: 'Easy Photo Upload',
    description: 'Upload images of the problem directly from your phone or computer.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 16v-8a2 2 0 012-2h12a2 2 0 012 2v8"/>
        <rect x="2" y="12" width="20" height="10" rx="2" ry="2"/>
        <circle cx="12" cy="17" r="3"/>
      </svg>
    )
  },
  {
    title: 'Real-time Tracking',
    description: 'Track your report status as municipal staff work on it.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    )
  },
  {
    title: 'Admin Dashboard',
    description: 'Efficiently manage and resolve reports with real-time data.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 12h18M12 3v18"/>
      </svg>
    )
  },
  {
    title: 'Community Engagement',
    description: 'Help your neighborhood improve by reporting problems quickly.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-3-3.87"/>
        <path d="M9 21v-2a4 4 0 013-3.87"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  }
];

const steps = [
  { number: 1, title: 'Identify the issue', description: 'Spot a pothole, broken streetlight, or garbage.' },
  { number: 2, title: 'Submit your report', description: 'Fill out the form with details and upload photos.' },
  { number: 3, title: 'Track progress', description: 'Monitor the status of your report live.' },
  { number: 4, title: 'See it resolved', description: 'Watch as your community gets better!' },
];

const testimonials = [
  {
    name: 'Jane Doe',
    quote: 'Reporting potholes has never been easier. The real-time tracking is fantastic!',
  },
  {
    name: 'John Smith',
    quote: 'Municipal staff respond quickly thanks to this platform. Highly recommended!',
  }
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen font-sans text-gray-900">
      
      {/* 🔹 Background with Blur */}
      <div className="absolute inset-0 "></div>

      {/* 🔹 Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16 ">
          <h1 className="text-4xl text-gray-900 dark:text-gray-50 font-extrabold mb-4 hover-up-down">
            Report Local Civic Issues — Fast & Easy
          </h1>
          <p className="text-lg text-gray-950 dark:text-gray-300 mb-8 hover-up-down">
            Submit photos and locations of potholes, streetlight problems, or garbage. Municipal staff can manage and resolve reports quickly.
          </p>
          <a
            href="/report"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition hover-up-down"
          >
            Report an Issue Now
          </a>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20 ">
          {features.map(({ title, description, icon }) => (
            <div key={title} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-default hover-up-down dark:bg-gray-800 dark:text-gray-50">
              <div className="mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-50">{description}</p>
            </div>
          ))}
        </section>

        {/* Steps Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 hover-up-down">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {steps.map(({ number, title, description }) => (
              <div key={number} className="bg-white p-6 rounded-lg shadow text-center hover-up-down dark:bg-gray-800">
                <div className="text-indigo-600 text-4xl font-bold mb-4">{number}</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-50">{title}</h3>
                <p className="text-gray-700 dark:text-gray-50">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 hover-up-down">What People Are Saying</h2>
          <div className="space-y-10">
            {testimonials.map(({ name, quote }) => (
              <blockquote
                key={name}
                className="bg-white p-8 rounded-lg shadow italic text-gray-800 hover-up-down dark:bg-gray-800 dark:text-gray-50"
              >
                <p className="mb-4 text-lg">"{quote}"</p>
                <footer className="text-right font-semibold">— {name}</footer>
              </blockquote>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}