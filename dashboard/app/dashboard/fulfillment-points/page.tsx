'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Plus, MapPin, Edit, Trash, Store, X } from 'lucide-react';
import { API_URL } from '@/config';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import {
    fetchFulfillmentPoints,
    createFulfillmentPoint,
    updateFulfillmentPoint,
    deleteFulfillmentPoint
} from '@/api/fulfillment-points';

type FulfillmentPoint = {
    id: number;
    name: string;
    address: string;
    city: string;
    lga: string;
    instructions: string;
    isActive: boolean;
    canVerifyVendors: boolean;
    platformCommissionRate: number;
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

    const loadPoints = async () => {
        try {
            setIsLoading(true);
            const data = await fetchFulfillmentPoints();
            setPoints(data);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to fetch fulfillment points', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPoints();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure? This will deactivate the fulfillment point.')) return;
        try {
            await deleteFulfillmentPoint(id);
            toast({ title: 'Success', description: 'Fulfillment point deactivated' });
            loadPoints();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to delete fulfillment point', variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Heading size="3xl" className="font-bold tracking-tight">Fulfillment Points</Heading>
                    <Text className="text-gray-500 mt-2">Manage pickup locations and verification centers (Vet Offices).</Text>
                </div>

                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 font-bold" onPress={() => { setIsDialogOpen(true); setEditingPoint(null); }}>
                    <Plus size={16} /> <ButtonText className="text-white">Add New Point</ButtonText>
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
                                        loadPoints();
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

                        <div className="flex flex-wrap gap-2">
                            {point.canVerifyVendors && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                    Verifies Vendors
                                </span>
                            )}
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                {point.platformCommissionRate}% Fee
                            </span>
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
            canVerifyVendors: true,
            platformCommissionRate: 5.0
        }
    });

    const { toast } = useToast();

    const onSubmit = async (data: any) => {
        try {
            if (initialData) {
                await updateFulfillmentPoint(initialData.id, data);
            } else {
                await createFulfillmentPoint(data);
            }

            toast({ title: 'Success', description: 'Saved successfully' });
            onSuccess();
        } catch (e: any) {
            toast({ title: 'Error', description: e.message || 'Something went wrong', variant: 'destructive' });
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

            <div className="space-y-2">
                <label className="text-sm font-medium">Platform Commission (%)</label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    {...register('platformCommissionRate', { valueAsNumber: true, required: 'Commission rate is required' })}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g. 5.0"
                />
                {errors.platformCommissionRate && <p className="text-red-500 text-xs">{errors.platformCommissionRate.message}</p>}
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('canVerifyVendors', { valueAsNumber: false })} />
                    <span className="text-sm">Can verify vendors?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('isActive', { valueAsNumber: false })} />
                    <span className="text-sm">Is Active?</span>
                </label>
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-6"
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
            >
                <ButtonText className="text-white font-bold">
                    {isSubmitting ? 'Saving...' : 'Save Fulfillment Point'}
                </ButtonText>
            </Button>
        </form>
    );
}
