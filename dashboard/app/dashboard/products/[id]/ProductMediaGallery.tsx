'use client';

import { useState } from 'react';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { ShoppingBagIcon, PlayCircle } from 'lucide-react';

interface ProductMediaGalleryProps {
    images: string[];
    productName: string;
    video?: string | null;
    isOutOfStock?: boolean;
}

export default function ProductMediaGallery({
    images,
    productName,
    video,
    isOutOfStock = false,
}: ProductMediaGalleryProps) {
    const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; src: string }>({
        type: 'image',
        src: images.length > 0 ? images[0] : '',
    });

    return (
        <div className="space-y-6">
            {/* Main Display Area */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative aspect-square sm:aspect-[4/3] w-full bg-gray-50">
                    {activeMedia.type === 'video' && video ? (
                        <video
                            src={video}
                            controls
                            autoPlay
                            className="w-full h-full object-contain bg-black"
                            poster={images[0]}
                        />
                    ) : activeMedia.src ? (
                        <Image
                            source={{ uri: activeMedia.src }}
                            className="w-full h-full object-contain" // Changed to object-contain to see full image
                            alt={productName}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <Icon as={ShoppingBagIcon} className="w-24 h-24 opacity-20" />
                        </div>
                    )}

                    {isOutOfStock && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full uppercase tracking-wider shadow-sm">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnails Grid */}
            {(images.length > 1 || video) && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4">
                    {/* Image Thumbnails */}
                    {images.map((img, index) => (
                        <button
                            key={`img-${index}`}
                            onClick={() => setActiveMedia({ type: 'image', src: img })}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white relative ${activeMedia.type === 'image' && activeMedia.src === img
                                ? 'border-blue-600 ring-2 ring-blue-100'
                                : 'border-transparent hover:border-blue-300'
                                }`}
                        >
                            <Image
                                source={{ uri: img }}
                                className="w-full h-full object-cover"
                                alt={`${productName} thumbnail ${index + 1}`}
                            />
                        </button>
                    ))}

                    {/* Video Thumbnail */}
                    {video && (
                        <button
                            onClick={() => setActiveMedia({ type: 'video', src: video })}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 bg-black/5 flex items-center justify-center group relative ${activeMedia.type === 'video'
                                ? 'border-blue-600 ring-2 ring-blue-100'
                                : 'border-transparent hover:border-blue-300'
                                }`}
                        >
                            {images.length > 0 && (
                                <div className="absolute inset-0 opacity-50">
                                    <Image
                                        source={{ uri: images[0] }}
                                        className="w-full h-full object-cover"
                                        alt="Video thumbnail"
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                            <Icon
                                as={PlayCircle}
                                className={`w-8 h-8 transition-colors relative z-10 ${activeMedia.type === 'video' ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'
                                    }`}
                            />
                        </button>
                    )}
                </div>
            )}

            {/* Separate Video Section for better visibility on mobile/consistency */}
            {video && (
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Icon as={PlayCircle} className="w-5 h-5 text-blue-600" />
                        Product Video
                    </h3>
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-sm border border-gray-200">
                        <video
                            src={video}
                            controls
                            className="w-full h-full"
                            poster={images[0]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
