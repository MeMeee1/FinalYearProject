'use client';

import { useState, useRef } from 'react';
import { z } from 'zod';
import { handleVendorSignup } from './actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, X, UploadCloud, ChevronDown, AlertCircle } from 'lucide-react-native';
// Removed custom components imports to use standard HTML + Tailwind
import { API_URL } from '@/config';


type FormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
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

// ... (ImageUploadField, FormInput, FormSelect components remain the same) ...
const ImageUploadField = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 h-32 flex flex-col items-center justify-center transition-all cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
        onClick={() => !value && inputRef.current?.click()}
      >
        {value ? (
          <div className="relative w-full h-full flex justify-center items-center group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain rounded"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-1.5 shadow-md border border-gray-100 hover:scale-110 transition-transform"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-blue-50 rounded-full mb-2 text-blue-600">
              <UploadCloud size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {loading ? 'Uploading...' : 'Click to Upload'}
            </span>
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>}
    </div>
  );
};

// Helper input component for consistency
const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  rightElement
}: {
  label: string,
  value: string,
  onChange: (val: string) => void,
  placeholder?: string,
  type?: string,
  error?: string,
  rightElement?: React.ReactNode
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all 
          ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500 text-gray-900'}
          placeholder:text-gray-400 text-sm`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
      {error}
    </p>}
  </div>
);

// Custom Select Input for City/Country
const FormSelect = ({
  label,
  value,
  options,
  onChange,
  error
}: {
  label: string,
  value: string,
  options: { label: string, value: string }[],
  onChange: (val: string) => void,
  error?: string
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer
                    ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500 text-gray-900'}
                    text-sm`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
        <ChevronDown size={16} />
      </div>
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
  </div>
);

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    const vendorData = {
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessEmail: formData.businessEmail,
      businessPhone: formData.businessPhone,
      storeName: formData.storeName,
      storeDescription: formData.storeDescription,
      storeLogo: formData.storeLogo,
      storeBanner: formData.storeBanner,
    };

    const result = await handleVendorSignup(formData.email, formData.password, vendorData);

    if (result?.error) {
      setErrors((prev) => ({ ...prev, email: result.error }));
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 font-sans">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Application</h1>
          <p className="text-sm text-gray-500 mt-2">Join our marketplace and start selling today.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
              <div
                className={`h-full transition-all duration-500 ease-out ${s <= step ? 'bg-blue-600 w-full' : 'w-0'}`}
              />
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Credentials</h2>

            <FormInput
              label="Email Address"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(v) => updateField('email', v)}
              error={errors.email}
            />

            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(v) => updateField('password', v)}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <button
              onClick={() => validateStep(1) && setStep(2)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
            >
              Next Step
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <FormInput label="First Name" placeholder="John" value={formData.firstName} onChange={v => updateField('firstName', v)} error={errors.firstName} />
              <FormInput label="Last Name" placeholder="Doe" value={formData.lastName} onChange={v => updateField('lastName', v)} error={errors.lastName} />
            </div>

            <FormInput label="Phone Number" placeholder="+234..." value={formData.phone} onChange={v => updateField('phone', v)} error={errors.phone} />
            <FormInput label="Personal Address" placeholder="123 Home St" value={formData.address} onChange={v => updateField('address', v)} error={errors.address} />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect label="City" value={formData.city} options={[{ label: 'Abuja', value: 'Abuja' }]} onChange={v => updateField('city', v)} error={errors.city} />
              <FormSelect label="Country" value={formData.country} options={[{ label: 'Nigeria', value: 'Nigeria' }]} onChange={v => updateField('country', v)} error={errors.country} />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2"><ArrowLeft size={18} /> Back</button>
              <button onClick={() => validateStep(2) && setStep(3)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm shadow-blue-200 flex items-center justify-center gap-2 group">Next Step <ArrowRight size={18} className="group-hover:translate-x-1" /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h2>

            <FormInput label="Business Name" placeholder="Legal Business Name" value={formData.businessName} onChange={v => updateField('businessName', v)} error={errors.businessName} />
            <FormInput label="Business Address" placeholder="123 Market St" value={formData.businessAddress} onChange={v => updateField('businessAddress', v)} error={errors.businessAddress} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Business Email" placeholder="contact@biz.com" value={formData.businessEmail} onChange={v => updateField('businessEmail', v)} error={errors.businessEmail} />
              <FormInput label="Business Phone" placeholder="+234..." value={formData.businessPhone} onChange={v => updateField('businessPhone', v)} error={errors.businessPhone} />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2"><ArrowLeft size={18} /> Back</button>
              <button onClick={() => validateStep(3) && setStep(4)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm shadow-blue-200 flex items-center justify-center gap-2 group">Next Step <ArrowRight size={18} className="group-hover:translate-x-1" /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Setup</h2>

            <FormInput label="Store Name" placeholder="My Awesome Store" value={formData.storeName} onChange={v => updateField('storeName', v)} error={errors.storeName} />
            <FormInput label="Description" placeholder="What do you sell?" value={formData.storeDescription} onChange={v => updateField('storeDescription', v)} error={errors.storeDescription} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField label="Store Logo" value={formData.storeLogo} onChange={v => updateField('storeLogo', v)} error={errors.storeLogo} />
              <ImageUploadField label="Store Banner" value={formData.storeBanner} onChange={v => updateField('storeBanner', v)} error={errors.storeBanner} />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={() => validateStep(4) && handleSubmit()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                Complete Signup <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {serverError && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5" size={20} />
            <p className="text-sm text-red-700 font-medium">{serverError}</p>
          </div>
        )}
      </div>


    </div>
  );
}

