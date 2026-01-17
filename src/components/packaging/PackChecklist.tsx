import { useState } from 'react';
import { CheckSquare, Square, FileText, Package, ClipboardCheck } from 'lucide-react';
import { PackChecklist as PackChecklistType, PackChecklistItem } from '@/types/packaging';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStrings } from '@/i18n/useStrings';
import { format } from 'date-fns';

interface PackChecklistProps {
  checklist: PackChecklistType;
  onItemToggle: (itemId: string, checked: boolean) => void;
  disabled?: boolean;
}

const categoryIcons = {
  physical: Package,
  document: FileText,
  verification: ClipboardCheck,
};

const categoryLabels = {
  physical: 'Physical Checks',
  document: 'Documents',
  verification: 'Verification',
};

export function PackChecklistComponent({
  checklist,
  onItemToggle,
  disabled = false,
}: PackChecklistProps) {
  const { t } = useStrings();

  const groupedItems = checklist.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<PackChecklistItem['category'], PackChecklistItem[]>);

  const completedCount = checklist.items.filter((i) => i.checked).length;
  const requiredCount = checklist.items.filter((i) => i.required).length;
  const completedRequired = checklist.items.filter((i) => i.required && i.checked).length;

  const getStatusBadge = () => {
    switch (checklist.status) {
      case 'completed':
        return <Badge className="bg-success text-white">{t('common.completed')}</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning text-white">{t('common.inProgress')}</Badge>;
      default:
        return <Badge variant="outline">{t('common.pending')}</Badge>;
    }
  };

  return (
    <div className="space-y-spacing-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-spacing-sm">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">{t('packaging.checklist.title')}</h3>
        </div>
        <div className="flex items-center gap-spacing-sm">
          {getStatusBadge()}
          <span className="text-sm text-text-muted">
            {completedRequired}/{requiredCount} {t('packaging.checklist.required')}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(completedCount / checklist.items.length) * 100}%` }}
        />
      </div>

      {/* Grouped Items */}
      {Object.entries(groupedItems).map(([category, items]) => {
        const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
        const categoryLabel = categoryLabels[category as keyof typeof categoryLabels];

        return (
          <div key={category} className="space-y-spacing-sm">
            <div className="flex items-center gap-spacing-xs text-sm font-medium text-text-muted">
              <CategoryIcon className="h-4 w-4" />
              <span>{categoryLabel}</span>
            </div>

            <div className="space-y-spacing-xs pl-spacing-md">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-spacing-sm p-spacing-sm rounded-radius-sm transition-colors ${
                    item.checked ? 'bg-success/5' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={(checked) => onItemToggle(item.id, checked as boolean)}
                    disabled={disabled}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={item.id}
                      className={`text-sm cursor-pointer ${
                        item.checked ? 'text-success line-through' : 'text-text'
                      }`}
                    >
                      {item.label}
                      {item.required && (
                        <span className="text-danger ml-1">*</span>
                      )}
                    </Label>
                    {item.checkedAt && (
                      <p className="text-xs text-text-muted mt-0.5">
                        {format(new Date(item.checkedAt), 'MMM d, h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {checklist.completedAt && (
        <div className="pt-spacing-md border-t border-border text-sm text-success">
          <CheckSquare className="h-4 w-4 inline mr-1" />
          {t('packaging.checklist.completedOn')}{' '}
          {format(new Date(checklist.completedAt), 'MMM d, yyyy h:mm a')}
        </div>
      )}
    </div>
  );
}
