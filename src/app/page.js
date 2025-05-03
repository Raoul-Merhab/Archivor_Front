import HeroSection from '@/features/HeroSection';
import FeatureSection from '@/features/FeatureSection';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureSection />
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Don't just take our word for it. See what our clients have to say about working with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">John Doe</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">CEO, TechStart</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic">
                "InnovDigital transformed our business with their innovative solutions. Their team's expertise and dedication exceeded our expectations."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Jane Smith</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">CTO, Global Solutions</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic">
                "Working with InnovDigital has been a game-changer for our company. Their attention to detail and technical expertise is unmatched."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">RJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Robert Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Founder, Innovate Inc</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic">
                "The team at InnovDigital delivered beyond our expectations. Their solutions have helped us increase efficiency by 40%."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="max-w-2xl mx-auto text-lg text-blue-100 mb-8">
            Get in touch with our team today and discover how we can help you achieve your digital goals.
          </p>
          <div className="inline-flex space-x-4">
            <Link href="/documents" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition-colors">
              Try Our Document Manager
            </Link>
            <Link href="/contact" className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
