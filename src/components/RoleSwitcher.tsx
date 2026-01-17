import { useAuth } from '@/contexts/AuthContext';
import { ROLES, ROLE_LABELS, Role } from '@/configs/roleConfig';
import { Users } from 'lucide-react';

export function RoleSwitcher() {
  const { user, setRole, isLoading } = useAuth();

  return (
    <div className="flex items-center gap-spacing-sm">
      <Users className="h-4 w-4 text-header-foreground/70" />
      <select
        value={user?.role || ''}
        onChange={(e) => setRole(e.target.value as Role)}
        disabled={isLoading}
        className="
          h-8 px-2 pr-8 rounded-radius-sm text-sm font-medium
          bg-header border border-header-foreground/20 text-header-foreground
          focus:outline-none focus:ring-2 focus:ring-focus
          disabled:opacity-50 cursor-pointer
          appearance-none
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1rem',
        }}
        aria-label="Switch user role"
      >
        {ROLES.map((role) => (
          <option key={role} value={role} className="bg-surface text-text">
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
    </div>
  );
}
