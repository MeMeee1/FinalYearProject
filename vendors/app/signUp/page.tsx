'use client';

import { useState, useRef } from 'react';
import { z } from 'zod';
import { handleVendorSignup } from './actions';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  X,
  UploadCloud,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building2,
  Store,
  Phone,
  MapPin,
  Camera,
  Image as ImageIcon,
  Activity
} from 'lucide-react';
import { API_URL } from '@/config';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

type FormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  lga: string;
  country: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  storeBanner: string;
};

const step1Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const step2Schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.literal('Abuja', { message: 'Only Abuja is supported' }),
  lga: z.enum(['Abaji', 'Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'], { message: 'Please select a valid LGA' }),
  country: z.literal('Nigeria', { message: 'Only Nigeria is supported' }),
});

const step3Schema = z.object({
  businessName: z.string().min(2),
  businessAddress: z.string().min(5),
  businessEmail: z.string().email(),
  businessPhone: z.string().min(10),
});

const step4Schema = z.object({
  storeName: z.string().min(2),
  storeDescription: z.string().min(10),
  storeLogo: z.string().url().optional().or(z.literal('')),
  storeBanner: z.string().url().optional().or(z.literal('')),
});

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const serverError = searchParams.get('errorMessage');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: 'Abuja',
    lga: 'Abuja Municipal',
    country: 'Nigeria',
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    businessPhone: '',
    storeName: '',
    storeDescription: '',
    storeLogo: '',
    storeBanner: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validateStep = (s: number) => {
    try {
      if (s === 1) step1Schema.parse(formData);
      if (s === 2) step2Schema.parse(formData);
      if (s === 3) step3Schema.parse(formData);
      if (s === 4) step4Schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const mapped: Record<string, string> = {};
        err.issues.forEach((i) => {
          mapped[String(i.path[0])] = i.message;
        });
        setErrors(mapped);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const vendorData = {
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      lga: formData.lga,
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessEmail: formData.businessEmail,
      businessPhone: formData.businessPhone,
      storeName: formData.storeName,
      storeDescription: formData.storeDescription,
      storeLogo: formData.storeLogo,
      storeBanner: formData.storeBanner,
    };

    try {
      const result = await handleVendorSignup(formData.email, formData.password, vendorData);
      if (result?.error) {
        setErrors((prev) => ({ ...prev, email: result.error }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-card rounded-[3rem] shadow-2xl shadow-primary/5 border border-border overflow-hidden relative backdrop-blur-sm">

          {/* Header */}
          <div className="p-10 pb-4 flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Store className="text-primary w-6 h-6" />
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex flex-col items-start">
                <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Onboarding</Text>
                <Heading className="text-xl font-black text-foreground leading-none">Step {step} of 4</Heading>
              </div>
            </div>
            <div className="space-y-1">
              <Heading className="text-3xl font-black tracking-tighter text-foreground">Join the Hub</Heading>
              <Text className="text-muted-foreground font-medium text-sm">Scale your business with our enterprise infrastructure.</Text>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-10 flex gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden relative">
                <div
                  className={`absolute inset-0 bg-primary transition-all duration-700 ease-out ${s <= step ? 'translate-x-0' : '-translate-x-full'}`}
                />
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-10 pt-4 space-y-8">
            <div className="min-h-[400px]">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <Lock className="w-5 h-5 text-primary" />
                    <Text className="text-sm font-black text-foreground uppercase tracking-widest">Authentication</Text>
                  </div>
                  <div className="space-y-6">
                    <FormInput
                      label="Institutional Email"
                      icon={Mail}
                      placeholder="you@enterprise.com"
                      value={formData.email}
                      onChange={(v) => updateField('email', v)}
                      error={errors.email}
                    />
                    <FormInput
                      label="Access Password"
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 high-security chars"
                      value={formData.password}
                      onChange={(v) => updateField('password', v)}
                      error={errors.password}
                      rightElement={
                        <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <User className="w-5 h-5 text-primary" />
                    <Text className="text-sm font-black text-foreground uppercase tracking-widest">Representative Profile</Text>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <FormInput label="First Name" icon={User} placeholder="James" value={formData.firstName} onChange={v => updateField('firstName', v)} error={errors.firstName} />
                    <FormInput label="Surname" icon={User} placeholder="Bond" value={formData.lastName} onChange={v => updateField('lastName', v)} error={errors.lastName} />
                  </div>
                  <FormInput label="Direct Line" icon={Phone} placeholder="+234..." value={formData.phone} onChange={v => updateField('phone', v)} error={errors.phone} />
                  <FormInput label="Home Residence" icon={MapPin} placeholder="Primary address" value={formData.address} onChange={v => updateField('address', v)} error={errors.address} />
                  <div className="grid grid-cols-2 gap-6">
                    <FormSelect label="City Hub" icon={MapPin} value={formData.city} options={[{ label: 'Abuja', value: 'Abuja' }]} onChange={v => updateField('city', v)} error={errors.city} />
                    <FormSelect label="Jurisdiction (LGA)" icon={MapPin} value={formData.lga} options={[
                      { label: 'Abaji', value: 'Abaji' },
                      { label: 'AMAC', value: 'Abuja Municipal' },
                      { label: 'Bwari', value: 'Bwari' },
                      { label: 'Gwagwalada', value: 'Gwagwalada' },
                      { label: 'Kuje', value: 'Kuje' },
                      { label: 'Kwali', value: 'Kwali' },
                    ]} onChange={v => updateField('lga', v)} error={errors.lga} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                    <Text className="text-sm font-black text-foreground uppercase tracking-widest">Corporate Identity</Text>
                  </div>
                  <FormInput label="Registered Entity Name" icon={Building2} placeholder="Legal Enterprise Ltd." value={formData.businessName} onChange={v => updateField('businessName', v)} error={errors.businessName} />
                  <FormInput label="Headquarters Address" icon={MapPin} placeholder="Commercial address" value={formData.businessAddress} onChange={v => updateField('businessAddress', v)} error={errors.businessAddress} />
                  <div className="grid grid-cols-2 gap-6">
                    <FormInput label="Corporate Email" icon={Mail} placeholder="ops@enterprise.com" value={formData.businessEmail} onChange={v => updateField('businessEmail', v)} error={errors.businessEmail} />
                    <FormInput label="Corporate Phone" icon={Phone} placeholder="+234..." value={formData.businessPhone} onChange={v => updateField('businessPhone', v)} error={errors.businessPhone} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <Store className="w-5 h-5 text-primary" />
                    <Text className="text-sm font-black text-foreground uppercase tracking-widest">Retail Config</Text>
                  </div>
                  <FormInput label="Marketplace Store Name" icon={Store} placeholder="Premium Retail Store" value={formData.storeName} onChange={v => updateField('storeName', v)} error={errors.storeName} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Brand Story</label>
                    <textarea
                      value={formData.storeDescription}
                      onChange={(e) => updateField('storeDescription', e.target.value)}
                      placeholder="What makes your store unique?"
                      className="w-full px-6 py-4 bg-secondary/30 border border-border rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none h-32"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <ImageUploadField label="Store Logo" value={formData.storeLogo} onChange={v => updateField('storeLogo', v)} error={errors.storeLogo} />
                    <ImageUploadField label="Brand Banner" value={formData.storeBanner} onChange={v => updateField('storeBanner', v)} error={errors.storeBanner} />
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex gap-4 pt-10 border-t border-border/50">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-8 py-4 bg-secondary/50 hover:bg-secondary text-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] border border-border flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Previous Cycle
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={() => validateStep(step) && setStep(step + 1)}
                  className="flex-[2] px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Initialize Step {step + 1} <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => validateStep(4) && !isSubmitting && handleSubmit()}
                  disabled={isSubmitting}
                  className="flex-[2] px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : 'Finalize Onboarding'}
                  {!isSubmitting && <CheckCircle2 size={16} />}
                </button>
              )}
            </div>
          </div>

          {serverError && (
            <div className="mx-10 mb-10 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3 text-destructive animate-in bounce-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <Text className="text-xs font-bold">{serverError}</Text>
            </div>
          )}

          <div className="p-8 bg-secondary/20 text-center border-t border-border/50">
            <Text className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
              Institutional Onboarding Protocol &bull; Step {step}/4
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

const FormInput = ({ label, icon: IconComponent, value, onChange, placeholder, type = 'text', error, rightElement }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">{label}</label>
    <div className="relative group">
      {IconComponent && <IconComponent className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${IconComponent ? 'pl-14' : 'px-6'} pr-6 py-4 rounded-2xl border bg-secondary/30 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground font-bold placeholder:text-muted-foreground/40 text-sm ${error ? 'border-destructive/50 ring-destructive/10' : 'border-border'}`}
      />
      {rightElement && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {error && <Text className="text-[10px] font-bold text-destructive ml-2 tracking-tight">{error}</Text>}
  </div>
);

const FormSelect = ({ label, icon: IconComponent, value, options, onChange, error }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">{label}</label>
    <div className="relative group">
      {IconComponent && <IconComponent className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${IconComponent ? 'pl-14' : 'px-6'} pr-12 py-4 rounded-2xl border bg-secondary/30 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground font-bold appearance-none cursor-pointer text-sm ${error ? 'border-destructive/50' : 'border-border'}`}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
    {error && <Text className="text-[10px] font-bold text-destructive ml-2 tracking-tight">{error}</Text>}
  </div>
);

const ImageUploadField = ({ label, value, onChange, error }: any) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_URL}/upload/image`, { method: 'POST', body: fd });
      const data = await res.json();
      onChange(data.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">{label}</label>
      <div
        className={`relative h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group hover:bg-primary/5 hover:border-primary ${value ? 'border-primary/20 bg-primary/5' : 'border-border bg-secondary/30'} ${error ? 'border-destructive/50' : ''}`}
        onClick={() => !value && !loading && inputRef.current?.click()}
      >
        {value ? (
          <div className="relative w-full h-full p-2">
            <img src={value} className="w-full h-full object-contain rounded-xl" alt="Preview" />
            <button
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-destructive shadow-lg hover:scale-110 active:scale-90 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-xl ${loading ? 'bg-primary/10' : 'bg-card'} border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all`}>
              {loading ? <Activity className="w-5 h-5 animate-spin text-primary" /> : <Camera className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />}
            </div>
            <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{loading ? 'Processing...' : 'Upload'}</Text>
          </div>
        )}
        <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
      </div>
      {error && <Text className="text-[10px] font-bold text-destructive ml-2 tracking-tight">{error}</Text>}
    </div>
  );
};
