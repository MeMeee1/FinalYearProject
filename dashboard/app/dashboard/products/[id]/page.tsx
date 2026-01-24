import { fetchProductById } from '@/api/products';
import ProductMediaGallery from './ProductMediaGallery';
import Link from 'next/link';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, ShoppingBagIcon, PlayCircle, Package, Clock, Tag } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await fetchProductById(Number(id));
  console.log('Product Page Data:', { id, name: product.name, video: product.video, hasImages: !!product.image });

  // Parse images
  let images: string[] = [];
  try {
    if (product.image) {
      const parsed = JSON.parse(product.image);
      if (Array.isArray(parsed)) {
        images = parsed;
      } else {
        images = [product.image];
      }
    }
  } catch (e) {
    if (product.image) images = [product.image];
  }

  // Format price
  const priceFormatted = typeof product.price === 'number'
    ? `$${product.price.toFixed(2)}`
    : `$${Number(product.price).toFixed(2)}`;

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8">
          <Link
            href={product.sellerId ? `/dashboard/products/vendor/${product.sellerId}` : '/dashboard/products'}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 shadow-sm transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Vendor Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Media (Images & Video) */}
          <div className="lg:col-span-7">
            <ProductMediaGallery
              images={images}
              productName={product.name}
              video={product.video}
              isOutOfStock={product.status === 'out_of_stock'}
            />
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
              {/* Header Info */}
              <div className="mb-6 pb-6 border-b border-gray-50">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                </div>
                {/* Vendor Ref */}
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Icon as={ShoppingBagIcon} className="w-4 h-4" />
                  <span>Vendor ID: {product.sellerId}</span>
                  {/* Note: Ideally we would fetch the vendor name here or pass it if available from previous page */}
                </div>
              </div>

              {/* Price & Stock */}
              <div className="flex items-end gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">{priceFormatted}</p>
                </div>
                <div className="h-10 w-px bg-gray-100"></div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Stock</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock}
                    </span>
                    <span className="text-sm text-gray-400">units</span>
                  </div>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">SKU</p>
                    <p className="text-gray-900 font-medium font-mono text-sm">{product.sku || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <Tag className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</p>
                    <p className="text-gray-900 font-medium capitalize flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${product.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {product.status || 'Active'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Agricultural Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-start gap-3">
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Breed / Species</p>
                    <p className="text-gray-900 font-bold text-sm">{product.speciesBreed || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-start gap-3">
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Growth Stage</p>
                    <p className="text-gray-900 font-bold text-sm capitalize">{product.growthStage || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-start gap-3">
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Age</p>
                    <p className="text-gray-900 font-bold text-sm">{product.age || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-start gap-3">
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Weight / Size</p>
                    <p className="text-gray-900 font-bold text-sm">{product.weightSize || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Health Info */}
              <div className="bg-green-50/30 rounded-2xl p-6 border border-green-100 mb-8">
                <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Health & Quality Records
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</p>
                    <p className="text-gray-900 font-semibold">{product.healthStatus || 'N/A'}</p>
                  </div>
                  {product.vaccinationStatus && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Vaccinations</p>
                      <p className="text-sm text-gray-600">{product.vaccinationStatus}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <div className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed">
                  {product.description ? (
                    product.description.split('\n').map((line: string, i: number) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))
                  ) : (
                    <p className="italic text-gray-400">No description provided.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
