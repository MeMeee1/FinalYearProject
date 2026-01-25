'use client';

import { useEffect, useState } from 'react';
import { updateVendorProfile } from '@/api/vendors';
import { uploadProductImage } from '../products/actions';
import LogoutButton from '../LogoutButton';
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { TrendingUp } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import {
    Building2,
    Store,
    Camera,
    Image as ImageIcon,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    LogOut,
    Save,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
    const { vendorProfile, isLoading: loading, refreshProfile } = useVendorProfile();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const handleSave = async () => {
        try {
            setSaving(true);
            setSuccess(false);
            let updatedFormData = { ...formData };

            if (logoFile) {
                const fd = new FormData();
                fd.append('image', logoFile.file);
                const url = await uploadProductImage(fd);
                if (url) updatedFormData.storeLogo = url;
            }

            if (bannerFile) {
                const fd = new FormData();
                fd.append('image', bannerFile.file);
                const url = await uploadProductImage(fd);
                if (url) updatedFormData.storeBanner = url;
            }

            await updateVendorProfile(updatedFormData);
            await refreshProfile();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save profile', err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Text className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Loading Preferences...</Text>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Store className="w-4 h-4 text-primary" />
                        </div>
                        <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Management</Text>
                    </div>
                    <Heading className="text-3xl font-black tracking-tight text-foreground">Store Settings</Heading>
                    <Text className="text-muted-foreground font-medium">Customize your brand identity and business details.</Text>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl shadow-primary/20 ${success ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:scale-105'
                        }`}
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Synchronizing...' : success ? 'Settings Saved' : 'Commit Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Visuals */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-card rounded-[2.5rem] border border-border p-8 space-y-8 sticky top-24">
                        <div className="space-y-6">
                            <Text className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">Brand Assets</Text>

                            {/* Logo */}
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-foreground uppercase tracking-tight">Store Identity (Logo)</label>
                                <div className="relative group w-32 h-32 mx-auto">
                                    <div className="w-full h-full rounded-[2rem] bg-secondary border-2 border-dashed border-border overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                        {(logoFile?.preview || formData.storeLogo) ? (
                                            <img
                                                src={logoFile?.preview || formData.storeLogo}
                                                alt="Store Logo"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Store className="w-8 h-8 text-muted-foreground opacity-20" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="logo-upload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'logo')}
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-card"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </label>
                                </div>
                            </div>

                            {/* Banner */}
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-foreground uppercase tracking-tight">Showcase Banner</label>
                                <div className="relative group aspect-[3/1] rounded-2xl bg-secondary border-2 border-dashed border-border overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                    {(bannerFile?.preview || formData.storeBanner) ? (
                                        <img
                                            src={bannerFile?.preview || formData.storeBanner}
                                            alt="Store Banner"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-muted-foreground opacity-20" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="banner-upload"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'banner')}
                                    />
                                    <label
                                        htmlFor="banner-upload"
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                                    >
                                        <Text className="text-white text-[10px] font-black uppercase tracking-widest">Update Banner</Text>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border/50">
                            <Text className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                                Note: These visuals are displayed to customers on your storefront. High-quality images increase trust.
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Store Information */}
                    <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Store className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <Heading className="text-xl font-black text-foreground">Marketplace Details</Heading>
                                <Text className="text-xs text-muted-foreground font-medium">Public information about your store.</Text>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Store Name</label>
                                <div className="relative group">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.storeName}
                                        disabled
                                        readOnly
                                        className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-bold text-muted-foreground cursor-not-allowed"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2" title="Store name cannot be changed">
                                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Bio / Description</label>
                                <textarea
                                    value={formData.storeDescription}
                                    onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                                    placeholder="Tell customers about your store..."
                                    rows={4}
                                    className="w-full px-5 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card focus:border-primary transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Context */}
                    <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <Heading className="text-xl font-black text-foreground">Entity Information</Heading>
                                <Text className="text-xs text-muted-foreground font-medium">Internal business registry and contacts.</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Legal Name</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        value={formData.businessName}
                                        disabled
                                        readOnly
                                        className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-bold text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Support Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        value={formData.businessEmail}
                                        disabled
                                        readOnly
                                        className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-bold text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Direct Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        value={formData.businessPhone}
                                        disabled
                                        readOnly
                                        className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-bold text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Physical Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.businessAddress}
                                        onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <Heading className="text-xl font-black text-foreground">Disbursements</Heading>
                                <Text className="text-xs text-muted-foreground font-medium">Where we send your earnings.</Text>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Banking Partner</label>
                                <input
                                    type="text"
                                    value={formData.businessBankName}
                                    onChange={(e) => setFormData({ ...formData, businessBankName: e.target.value })}
                                    className="w-full px-5 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Account Number</label>
                                <input
                                    type="text"
                                    value={formData.businessAccountNumber}
                                    onChange={(e) => setFormData({ ...formData, businessAccountNumber: e.target.value })}
                                    className="w-full px-5 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commercial Terms */}
                    <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <Heading className="text-xl font-black text-foreground">Commercial Terms</Heading>
                                <Text className="text-xs text-muted-foreground font-medium">Your partnership agreement with the platform.</Text>
                            </div>
                        </div>

                        <div className="p-6 bg-secondary/30 rounded-3xl border border-border/50 flex items-center justify-between">
                            <div className="space-y-1">
                                <Text className="text-xs font-black text-foreground uppercase tracking-widest">Platform Service Fee</Text>
                                <Text className="text-[10px] text-muted-foreground font-medium">Commission deducted from each successful transaction.</Text>
                            </div>
                            <div className="text-right">
                                <Text className="text-2xl font-black text-primary">{vendorProfile?.platformCommissionRate || 10.0}%</Text>
                                <Text className="text-[10px] text-muted-foreground font-black uppercase">Active Rate</Text>
                            </div>
                        </div>
                    </div>

                    {/* Account Security */}
                    <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-destructive" />
                            </div>
                            <div className="flex-1">
                                <Heading className="text-xl font-black text-foreground">Account Access</Heading>
                                <Text className="text-xs text-muted-foreground font-medium">Manage your session.</Text>
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
