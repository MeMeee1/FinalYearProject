'use client';

import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import LogoutButton from './LogoutButton';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                <Avatar className="w-10 h-10 bg-blue-100 border-2 border-blue-200">
                    <AvatarFallbackText className="text-blue-700 font-semibold">VH</AvatarFallbackText>
                </Avatar>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[100]">
                    <div className="py-1">
                        <Link
                            href="/dashboard/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Settings
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <LogoutButton variant="dropdown" />
                    </div>
                </div>
            )}
        </div>
    );
}
