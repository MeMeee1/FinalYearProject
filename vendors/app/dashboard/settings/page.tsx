'use client';

import { useEffect, useState } from 'react';

/* API */
import { updateVendorProfile } from '@/api/vendors';
import { uploadProductImage } from '../products/actions';
import LogoutButton from '../LogoutButton';
import { useVendorProfile } from '@/hooks/useVendorProfile';

export default function SettingsPage() {
    const { vendorProfile, isLoading: loading, refreshProfile } = useVendorProfile();
    const [saving, setSaving] = useState(false);

    const [logoFile, setLogoFile] = useState<{ file: File; preview: string } | null>(null);
    const [bannerFile, setBannerFile] = useState<{ file: File; preview: string } | null>(null);

    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        storeLogo: '',
        storeBanner: '',
        businessName: '',
        businessAddress: '',
        businessEmail: '',
        businessPhone: '',
        businessBankName: '',
        businessAccountNumber: '',
    });

    /* SYNC FORM DATA WITH STORE */
    useEffect(() => {
        if (vendorProfile) {
            setFormData({
                storeName: vendorProfile.storeName ?? '',
                storeDescription: vendorProfile.storeDescription ?? '',
                storeLogo: vendorProfile.storeLogo ?? '',
                storeBanner: vendorProfile.storeBanner ?? '',
                businessName: vendorProfile.businessName ?? '',
                businessAddress: vendorProfile.businessAddress ?? '',
                businessEmail: vendorProfile.businessEmail ?? '',
                businessPhone: vendorProfile.businessPhone ?? '',
                businessBankName: (vendorProfile as any).businessBankName ?? '',
                businessAccountNumber: (vendorProfile as any).businessAccountNumber ?? '',
            });
        }
    }, [vendorProfile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const preview = URL.createObjectURL(file);
            if (type === 'logo') {
                setLogoFile({ file, preview });
            } else {
                setBannerFile({ file, preview });
            }
        }
    };

    /* SAVE PROFILE */
    const handleSave = async () => {
        try {
            setSaving(true);
            let updatedFormData = { ...formData };

            // Upload images if changed
            if (logoFile) {
                const formData = new FormData();
                formData.append('image', logoFile.file);
                const url = await uploadProductImage(formData);
                if (url) updatedFormData.storeLogo = url;
            }

            if (bannerFile) {
                const formData = new FormData();
                formData.append('image', bannerFile.file);
                // Reusing product image upload for banner as well for now
                const url = await uploadProductImage(formData);
                if (url) updatedFormData.storeBanner = url;
            }

            await updateVendorProfile(updatedFormData);
            await refreshProfile(); // Refresh from server to get latest data
            alert('Profile updated successfully');
        } catch (err) {
            console.error('Failed to save profile', err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };




    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            {/* PAGE HEADER */}
            <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-gray-500 mt-2">
                    Manage your store preferences and profile
                </p>
            </div>



            {/* PROFILE */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">👤</span>
                    <h2 className="text-xl font-semibold">Store Profile</h2>
                </div>

                <div className="space-y-6">

                    {/* Branding Section */}
                    <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <label className="block text-sm font-medium mb-2">Store Logo</label>
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative">
                                    {(logoFile?.preview || formData.storeLogo) ? (
                                        <img
                                            src={logoFile?.preview || formData.storeLogo}
                                            alt="Store Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl">🏪</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="logo-upload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'logo')}
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-50"
                                    >
                                        Change Logo
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Store Banner</label>
                            <div className="w-full h-24 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative mb-2">
                                {(bannerFile?.preview || formData.storeBanner) ? (
                                    <img
                                        src={bannerFile?.preview || formData.storeBanner}
                                        alt="Store Banner"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl">🖼️</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="banner-upload"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, 'banner')}
                                />
                                <label
                                    htmlFor="banner-upload"
                                    className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-50"
                                >
                                    Change Banner
                                </label>
                                <p className="text-xs text-gray-500">Recommended: 1200x300px</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Store Name</label>
                        <input
                            type="text"
                            value={formData.storeName}
                            onChange={(e) =>
                                setFormData({ ...formData, storeName: e.target.value })
                            }
                            placeholder="Store name"
                            disabled
                            readOnly
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Store Description</label>
                        <textarea
                            value={formData.storeDescription}
                            onChange={(e) =>
                                setFormData({ ...formData, storeDescription: e.target.value })
                            }
                            placeholder="Short description"
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Business Name</label>
                            <input
                                type="text"
                                value={formData.businessName}
                                onChange={(e) =>
                                    setFormData({ ...formData, businessName: e.target.value })
                                }
                                placeholder="Legal business name"
                                disabled
                                readOnly
                                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Business Phone</label>
                            <input
                                type="text"
                                value={formData.businessPhone}
                                onChange={(e) =>
                                    setFormData({ ...formData, businessPhone: e.target.value })
                                }
                                placeholder="+234..."
                                disabled
                                readOnly
                                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Business Email</label>
                        <input
                            type="email"
                            value={formData.businessEmail}
                            onChange={(e) =>
                                setFormData({ ...formData, businessEmail: e.target.value })
                            }
                            placeholder="email@business.com"
                            disabled
                            readOnly
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Business Address</label>
                        <input
                            type="text"
                            value={formData.businessAddress}
                            onChange={(e) =>
                                setFormData({ ...formData, businessAddress: e.target.value })
                            }
                            placeholder="Full address"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Bank Details */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Bank Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    value={formData.businessBankName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, businessBankName: e.target.value })
                                    }
                                    placeholder="e.g. Chase Bank"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Account Number</label>
                                <input
                                    type="text"
                                    value={formData.businessAccountNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, businessAccountNumber: e.target.value })
                                    }
                                    placeholder="0000000000"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            disabled={saving}
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* LOGOUT SECTION */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🚪</span>
                    <h2 className="text-xl font-semibold">Account</h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Sign out of your vendor account
                </p>

                <LogoutButton />
            </div>
        </div>
    );
}