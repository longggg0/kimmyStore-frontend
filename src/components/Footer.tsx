import { MapPin, Mail, Phone, Flag } from 'lucide-react';

export function Footer(){
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Brand Name */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#ff6b9d]">Kimmy Skincare</h2>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-base">
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-[15px]">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-[15px]">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-[15px]">
                  Policies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-[15px]">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Middle Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-base">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-[15px]">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ff6b9d] hover:text-[#e5588a] font-medium transition-colors text-[15px]">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-[15px]">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-base">
              Contact Us
            </h3>
            <ul className="space-y-3">
              
              <li className="flex items-start gap-2 text-gray-600 text-[15px]">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ff6b9d]" />
                <span>
                  St. 271, Toul Kork, Phnom Penh, Cambodia
                </span>
              </li>

              <li className="flex items-center gap-2 text-gray-600 text-[15px]">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#ff6b9d]" />
                <a href="mailto:info@kimmyskincare.com" className="hover:text-[#ff6b9d] transition-colors">
                  info@kimmyskincare.com
                </a>
              </li>

              <li className="flex items-center gap-2 text-gray-600 text-[15px]">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#ff6b9d]" />
                <a href="tel:+85512345678" className="hover:text-[#ff6b9d] transition-colors">
                  +855 12 345 678
                </a>
              </li>

              <li className="flex items-center gap-2 text-gray-600 text-[15px]">
                <Flag className="w-4 h-4 flex-shrink-0 text-[#ff6b9d]" />
                <span>Cambodia 🇰🇭</span>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-[15px]">
            Copyright © 2024 Kimmy Skincare. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}