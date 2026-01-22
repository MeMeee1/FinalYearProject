'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Edit, Trash, Store, X } from 'lucide-react';
import { API_URL } from '@/config';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';

type FulfillmentPoint = {
    id: number;
    name: string;
    address: string;
    city: string;
    lga: string;
    instructions: string;
    isActive: boolean;
    canVerifyVendors: boolean;
};

const lgaOptions = [
    'Abaji', 'Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'
];

export default function FulfillmentPointsPage() {
    const [points, setPoints] = useState<FulfillmentPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPoint, setEditingPoint] = useState<FulfillmentPoint | null>(null);

    const fetchPoints = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/fulfillment-points`);
            const data = await res.json();
            setPoints(data);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to fetch fulfillment points', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure? This will deactivate the fulfillment point.')) return;
        try {
            const res = await fetch(`${API_URL}/fulfillment-points/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Admin token
                }
            });
            if (res.ok) {
                toast({ title: 'Success', description: 'Fulfillment point deactivated' });
                fetchPoints();
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete fulfillment point', variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Heading size="3xl" className="font-bold tracking-tight">Fulfillment Points</Heading>
                    <Text className="text-gray-500 mt-2">Manage pickup locations and verification centers (Vet Offices).</Text>
                </div>

                <Button className="gap-2" onPress={() => { setIsDialogOpen(true); setEditingPoint(null); }}>
                    <Plus size={16} /> Add New Point
                </Button>

                {isDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] overflow-hidden">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between mb-2">
                                    <Heading size="xl">{editingPoint ? 'Edit Fulfillment Point' : 'Add Fulfillment Point'}</Heading>
                                    <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                                        <X size={20} />
                                    </button>
                                </div>
                                <Text className="text-gray-500">
                                    Create a new location for order pickups and vendor verification.
                                </Text>
                            </div>
                            <div className="p-6">
                                <FulfillmentPointForm
                                    initialData={editingPoint}
                                    onSuccess={() => {
                                        setIsDialogOpen(false);
                                        fetchPoints();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {points.map((point) => (
                    <Card key={point.id} className="p-6 relative group overflow-hidden border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Store className="w-4 h-4 text-blue-500" />
                                    <Heading size="md" className="font-semibold">{point.name}</Heading>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {point.city}, {point.lga}
                                </div>
                            </div>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${point.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {point.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {point.address}
                        </div>

                        <div className="flex gap-2">
                            {point.canVerifyVendors && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                    Verifies Vendors
                                </span>
                            )}
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => {
                                    setEditingPoint(point);
                                    setIsDialogOpen(true);
                                }}
                                className="p-2 bg-white shadow-sm border rounded-full hover:bg-gray-50 text-gray-700"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(point.id)}
                                className="p-2 bg-white shadow-sm border rounded-full hover:bg-red-50 text-red-500"
                            >
                                <Trash size={14} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function FulfillmentPointForm({ initialData, onSuccess }: { initialData?: FulfillmentPoint | null, onSuccess: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Omit<FulfillmentPoint, 'id' | 'createdAt' | 'updatedAt'>>({
        defaultValues: initialData || {
            name: '',
            address: '',
            city: 'Abuja',
            lga: 'Abuja Municipal',
            instructions: '',
            isActive: true,
            canVerifyVendors: true
        }
    });

    const { toast } = useToast();

    const onSubmit = async (data: any) => {
        try {
            const url = initialData ? `${API_URL}/fulfillment-points/${initialData.id}` : `${API_URL}/fulfillment-points`;
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to save');

            toast({ title: 'Success', description: 'Saved successfully' });
            onSuccess();
        } catch (e) {
            toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. Bwari Vet Clinic"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <input
                    {...register('address', { required: 'Address is required' })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Detailed street address"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <select {...register('city')} className="w-full p-2 border rounded-md">
                        <option value="Abuja">Abuja</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">LGA</label>
                    <select {...register('lga')} className="w-full p-2 border rounded-md">
                        {lgaOptions.map(lga => (
                            <option key={lga} value={lga}>{lga}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Instructions (Optional)</label>
                <textarea
                    {...register('instructions')}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. Ask for Dr. Amit"
                />
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('canVerifyVendors')} />
                    <span className="text-sm">Can verify vendors?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('isActive')} />
                    <span className="text-sm">Is Active?</span>
                </label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Fulfillment Point'}
            </Button>
        </form>
    );
}
