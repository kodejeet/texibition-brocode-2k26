import { ArrowRight, BellRing, PieChart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const features = [
    {
      icon: <BellRing className="w-6 h-6 text-brand-400" />,
      title: 'Smart Alerts',
      desc: 'Get notified days before a subscription renews so you never pay for unwanted services.'
    },
    {
      icon: <PieChart className="w-6 h-6 text-brand-400" />,
      title: 'Expense Tracking',
      desc: 'See exactly where your money goes with visual breakdowns of your monthly spend.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-400" />,
      title: 'Secure Data',
      desc: 'Your financial data and subscription details are encrypted and stored securely.'
    }
  ];

  return (
    <div className="relative isolate pt-14">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-600 to-indigo-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="mb-8 flex justify-center">
              <span className="relative rounded-full px-3 py-1 text-sm leading-6 text-brand-300 ring-1 ring-white/10 hover:ring-white/20">
                Announcing our next-gen tracker. <a href="#" className="font-semibold text-brand-400"><span className="absolute inset-0" />Read more <span aria-hidden="true">&rarr;</span></a>
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-gradient pb-4">
              Take control of your subscriptions today.
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Stop bleeding money on forgotten tools. SubTrack monitors your recurring expenses, alerts you before charges hit, and gives you a bird's-eye view of your financial commitments.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all flex items-center gap-2"
              >
                Get started <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-foreground hover:text-brand-300 transition-colors">
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col glass-card p-8 rounded-2xl items-start">
                  <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10 mb-4 inline-flex">
                    {feature.icon}
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-foreground mb-2">
                    {feature.title}
                  </dt>
                  <dd className="leading-7 text-muted-foreground flex-auto">
                    {feature.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
