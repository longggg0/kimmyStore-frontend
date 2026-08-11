import {  TrendingUp } from 'lucide-react';
import { useGetBrands } from '@/hook/useBrand';
import { useTopSellingProducts } from '@/hook/useTopSellingProduct';
import { useNewArrivalProducts } from '@/hook/useNewArrivalProducts';
import type { Product } from '@/types/Product';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '../Context/LanguageContext';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { t } = useLanguage();
  const { data: topSellingData, isLoading: topSellingLoading } = useTopSellingProducts(4);
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useNewArrivalProducts(4);
  const { data: brandsData } = useGetBrands();

  const topSellingProducts: Product[] = topSellingData?.data ?? [];
  const newArrivalProducts: Product[] = newArrivalsData?.data ?? [];
  const brands = brandsData?.data ?? [];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                {t('hero.subtitle')}
              </p>
              <Link to="/productPage">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
                {t('hero.cta')}
              </button>
              </Link>
              
            </div>
            <div>
  {topSellingProducts?.length > 0 && (
    <img
      src="/skincareHero.jpg"
      alt="Hero"
      className="rounded-2xl shadow-2xl w-full h-[260px] sm:h-[320px] md:h-[400px] object-cover"
    />
  )}
</div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* <Clock className="w-8 h-8" /> */}
              <div>
                {/* <h3 className="text-xl">{t('promo.title')}</h3> */}
                {/* <p className="text-sm opacity-90">{t('promo.subtitle')}</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4 text-center">
              {/* <div><div className="text-2xl">02</div><div className="text-xs opacity-75">{t('promo.days')}</div></div>
              <div className="text-2xl">:</div>
              <div><div className="text-2xl">15</div><div className="text-xs opacity-75">{t('promo.hours')}</div></div>
              <div className="text-2xl">:</div>
              <div><div className="text-2xl">30</div><div className="text-xs opacity-75">{t('promo.minutes')}</div></div>
              <div className="text-2xl">:</div>
              <div><div className="text-2xl">45</div><div className="text-xs opacity-75">{t('promo.seconds')}</div></div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
            <h2 className="text-2xl sm:text-3xl text-gray-900">{t('section.topSelling')}</h2>
          </div>
          {topSellingLoading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {topSellingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl text-gray-900">{t('section.newArrivals')}</h2>
            <button className="text-sm sm:text-base text-pink-400 hover:text-pink-500">{t('section.viewAll')}</button>
          </div>
          {newArrivalsLoading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {newArrivalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-3 sm:mb-4" style={{ letterSpacing: '0.02em' }}>
              {t('section.brands')}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 tracking-wide">
              {t('section.brandsSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
            {brands.map((brand) => (
              <Link key={brand.id} to={`/productPage?brand=${encodeURIComponent(brand.name)}`}>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
          <div className="aspect-[3/4] bg-gray-200" />
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-8 bg-gray-200 rounded-xl w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}