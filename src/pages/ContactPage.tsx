import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useLanguage } from '../Context/LanguageContext';

// ⚠️ These are exposed to anyone who views your site's source/network tab.
// Fill these in locally — do not commit real values to a public repo.
const TELEGRAM_BOT_TOKEN = '8922031691:AAGZoPBtdWXyJMBGDsy7QwbzBvJVonBMaxU';
const TELEGRAM_CHAT_ID = '1384205752';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const text = `📩 New Contact Message
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message:
${formData.message}`;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      alert('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-3 sm:mb-4">{t('contact.title')}</h1>
          <p className="text-base sm:text-lg text-gray-600 px-2">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl text-gray-900 mb-4 sm:mb-6">{t('contact.sendMessage')}</h2>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                  <Send className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl text-gray-900 mb-2">{t('contact.messageSent')}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t('contact.thankYou')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 sm:mb-2">{t('contact.fullName')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 sm:mb-2">{t('contact.email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 sm:mb-2">{t('contact.subject')}</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 sm:mb-2">{t('contact.yourMessage')}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed text-base"
                >
                  <Send className="w-5 h-5 flex-shrink-0" />
                  {isSending ? 'Sending...' : t('contact.send')}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6">

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl text-gray-900 mb-4 sm:mb-6">{t('contact.getInTouch')}</h2>

              <div className="space-y-4 sm:space-y-6">

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm text-gray-900 mb-1">{t('contact.address')}</h3>
                    <p className="text-sm sm:text-base text-gray-600 break-words">{t('contact.addressValue')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm text-gray-900 mb-1">{t('contact.phone')}</h3>
                    <p className="text-sm sm:text-base text-gray-600">+855 12 345 678</p>
                    <p className="text-sm sm:text-base text-gray-600">+855 98 765 432</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm text-gray-900 mb-1">{t('contact.email')}</h3>
                    <p className="text-sm sm:text-base text-gray-600 break-all">info@skincare.com</p>
                    <p className="text-sm sm:text-base text-gray-600 break-all">support@skincare.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm text-gray-900 mb-1">{t('contact.businessHours')}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{t('contact.hoursWeekday')}</p>
                    <p className="text-sm sm:text-base text-gray-600">{t('contact.hoursSaturday')}</p>
                    <p className="text-sm sm:text-base text-gray-600">{t('contact.hoursSunday')}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b">
                <h2 className="text-xl sm:text-2xl text-gray-900">{t('contact.visitUs')}</h2>
              </div>
              <div className="relative h-[280px] sm:h-[350px] md:h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7426754950477!2d104.91594931478593!3d11.568271491842797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951e96d257a6f%3A0x6b66703c8bf29fdf!2sPhnom%20Penh%2C%20Cambodia!5e0!3m2!1sen!2s!4v1641234567890!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Store Location"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}