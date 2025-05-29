import { Link } from 'react-router-dom';
import { ShieldCheckIcon, MapIcon, ChatBubbleLeftRightIcon, BellAlertIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Real-time Incident Reporting',
    description: 'Report emergencies and incidents instantly with location tracking and media upload capabilities.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Live Incident Map',
    description: 'Interactive map showing real-time incidents and emergency zones in your area.',
    icon: MapIcon,
  },
  {
    name: '24/7 AI Support',
    description: 'Get immediate assistance through our advanced AI-powered emergency response system.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Emergency Alerts',
    description: 'Receive instant notifications about emergencies and updates in your community.',
    icon: BellAlertIcon,
  },
  {
    name: 'Community Engagement',
    description: 'Connect with your community, share updates, and participate in emergency preparedness.',
    icon: UserGroupIcon,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Track incident patterns and response times with detailed analytics.',
    icon: ChartBarIcon,
  }
];

const howItWorks = [
  {
    step: 1,
    title: 'Report an Incident',
    description: 'Use our intuitive reporting system to quickly document emergencies with photos, location, and details.'
  },
  {
    step: 2,
    title: 'AI Assessment',
    description: 'Our AI system immediately analyzes the report to determine severity and required response.'
  },
  {
    step: 3,
    title: 'Community Alert',
    description: 'Relevant authorities and community members are notified based on incident type and location.'
  },
  {
    step: 4,
    title: 'Track Response',
    description: 'Monitor the incident status and response progress in real-time through our platform.'
  }
];

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              Your Community's Guardian
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              GuardianBot leverages AI technology to revolutionize community emergency response. Stay connected, informed, and protected 24/7.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/report" className="btn bg-primary-600 hover:bg-primary-500 text-white">
                Report Emergency
              </Link>
              <Link to="/community" className="btn bg-white/10 hover:bg-white/20 text-white">
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-24 bg-black/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-400">
              How It Works
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Streamlined Emergency Response
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {howItWorks.map((item) => (
                <div key={item.step} className="flex flex-col items-start">
                  <div className="rounded-full bg-primary-600/10 p-2 ring-1 ring-primary-600/20">
                    <span className="text-2xl font-bold text-primary-400">{item.step}</span>
                  </div>
                  <dt className="mt-4 font-semibold text-white">{item.title}</dt>
                  <dd className="mt-2 leading-7 text-gray-400">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-400">
              Powerful Features
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for community safety
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold text-white">
                    <feature.icon className="h-5 w-5 flex-none text-primary-400" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}