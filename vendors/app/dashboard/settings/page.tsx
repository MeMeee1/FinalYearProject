'use client';

import { useEffect, useState } from 'react';

/* API */
import { getVendorProfile, updateVendorProfile } from '@/api/vendors';
import LogoutButton from '../LogoutButton';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        businessName: '',
        businessAddress: '',
        businessEmail: '',
        businessPhone: '',
    });

    /* LOAD PROFILE */
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getVendorProfile();
            if (data) {
                setFormData({
                    storeName: data.storeName ?? '',
                    storeDescription: data.storeDescription ?? '',
                    businessName: data.businessName ?? '',
                    businessAddress: data.businessAddress ?? '',
                    businessEmail: data.businessEmail ?? '',
                    businessPhone: data.businessPhone ?? '',
                });
            }
        } catch (err) {
            console.error('Failed to load profile', err);
        } finally {
            setLoading(false);
        }
    };

    /* SAVE PROFILE */
    const handleSave = async () => {
        try {
            setSaving(true);
            await updateVendorProfile(formData);
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

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Store Name</label>
                        <input
                            type="text"
                            value={formData.storeName}
                            onChange={(e) =>
                                setFormData({ ...formData, storeName: e.target.value })
                            }
                            placeholder="Store name"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Store Description</label>
                        <input
                            type="text"
                            value={formData.storeDescription}
                            onChange={(e) =>
                                setFormData({ ...formData, storeDescription: e.target.value })
                            }
                            placeholder="Short description"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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