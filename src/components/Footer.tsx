import { MapPin, Mail, Phone, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/Context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200 mt-10 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Brand */}
        <div className="mb-6 sm:mb-8 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-[#ff6b9d]">
            {t("footer.brand")}
          </h2>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 text-center sm:text-left">

          {/* Left */}
          <div>
            <Link to="/">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base hover:text-[#ff6b9d] transition-colors">
                {t("footer.home")}
              </h3>
            </Link>

            <ul className="space-y-2">
              {/* <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-sm sm:text-[15px]"
                >
                  {t("footer.about")}
                </a>
              </li> */}

              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-sm sm:text-[15px]"
                >
                  {t("footer.services")}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-sm sm:text-[15px]"
                >
                  {t("footer.policies")}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-sm sm:text-[15px]"
                >
                  {t("footer.faq")}
                </a>
              </li>
            </ul>
          </div>

          {/* Middle */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base">
              {t("footer.customerService")}
            </h3>

            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-sm sm:text-[15px]"
                >
                  {t("footer.contactSupport")}
                </Link>
              </li>

              <li>
                <a
                  href="#"
                  className="text-[#ff6b9d] hover:text-[#e5588a] font-medium transition-colors text-sm sm:text-[15px]"
                >
                  {t("footer.shippingInfo")}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#ff6b9d] transition-colors text-sm sm:text-[15px]"
                >
                  {t("footer.returnPolicy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Right */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base">
              {t("footer.contactUs")}
            </h3>

            <ul className="space-y-3">

              <li className="flex items-start gap-2 text-gray-600 text-sm sm:text-[15px] text-left justify-center sm:justify-start">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ff6b9d]" />
                <span>{t("footer.address")}</span>
              </li>

              <li className="flex items-center gap-2 text-gray-600 text-sm sm:text-[15px] justify-center sm:justify-start">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#ff6b9d]" />
                <a
                  href="mailto:kimmySkincare01@gmail.com"
                  className="hover:text-[#ff6b9d] transition-colors break-all"
                >
                  kimmySkincare01@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2 text-gray-600 text-sm sm:text-[15px] justify-center sm:justify-start">
                <Phone className="w-4 h-4 shrink-0 text-[#ff6b9d]" />
                <a
                  href="tel:+85595380005"
                  className="hover:text-[#ff6b9d] transition-colors"
                >
                  +855 95 380 005
                </a>
              </li>

              <li className="flex items-center gap-2 text-gray-600 text-sm sm:text-[15px] justify-center sm:justify-start">
                <Flag className="w-4 h-4 shrink-0 text-[#ff6b9d]" />
                <span>{t("footer.country")}</span>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm sm:text-[15px]">
             Kimmy Skincare. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;