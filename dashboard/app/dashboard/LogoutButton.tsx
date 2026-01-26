'use client';

import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { logout } from '@/api/auth';
import { useTransition, useState } from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'header' | 'sidebar' | 'mobile';
}

export default function LogoutButton({ variant = 'header' }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  if (variant === 'sidebar') {
    return (
      <Button
        onPress={handleLogout}
        variant="outline"
        className="w-full"
        isDisabled={isPending}
      >
        <ButtonText>{isPending ? 'Logging out...' : 'Logout'}</ButtonText>
      </Button>
    );
  }

  if (variant === 'mobile') {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <LogOut className="w-6 h-6" />
        <span className="text-xs">{isPending ? '...' : 'Logout'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Avatar size="sm">
          <AvatarFallbackText>AD</AvatarFallbackText>
        </Avatar>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-slate-500">admin</p>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
