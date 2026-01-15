'use client';

import { logout } from '@/api/auth';
import { useTransition } from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'dropdown' | 'button';
}

export default function LogoutButton({ variant = 'button' }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
    >
      <LogOut className="w-5 h-5" />
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
