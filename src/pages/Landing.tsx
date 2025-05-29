import { Link } from 'react-router-dom';
import { ShieldCheckIcon, MapIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Real-time Incident Reporting',
    description: 'Report emergencies and incidents instantly with our easy-to-use platform.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Live Incident Map',
    description: 'View and track incidents in your area with our interactive map.',
    icon: MapIcon,
  },
  {
    name: '24/7 Chat Support',
    description: 'Get immediate assistance through our AI-powered chatbot.',
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function Landing() {
  return (
    <div className="bg-white">
      <main>
        {/* Hero section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Your Neighborhood's First Responder
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                GuardianBot helps you report and manage community emergencies in real-time. Stay connected, stay safe.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to="/report" className="btn btn-primary">
                  Report Issue
                </Link>
                <Link to="/community" className="btn btn-secondary">
                  Visit Community Hub
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-600">
                Community Safety
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to keep your community safe
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}