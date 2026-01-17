import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Search, Filter, X } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageCard } from '@/components/ui/PageCard';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Skeleton, SkeletonCard } from '@/components/ui/CustomSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { NcrBoard as NcrBoardComponent } from '@/components/quality/NcrBoard';
import { qualityService } from '@/services/qualityService';
import { NCR, NcrStatus, NcrFilters } from '@/types/quality';
import { useStrings } from '@/i18n/useStrings';
import { toast } from 'sonner';
import { mockUsers } from '@/mocks/users';
import { format } from 'date-fns';

type ViewState = 'loading' | 'error' | 'empty' | 'data';

export function NcrBoardPage() {
  const { t } = useStrings();

  const [viewState, setViewState] = useState<ViewState>('loading');
  const [ncrs, setNcrs] = useState<NCR[]>([]);
  const [filteredNcrs, setFilteredNcrs] = useState<NCR[]>([]);
  const [filters, setFilters] = useState<NcrFilters>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [counts, setCounts] = useState<Record<NcrStatus, number>>({
    raised: 0, disposition: 0, rework: 0, retest: 0, closed: 0
  });

  // Detail sheet
  const [selectedNcr, setSelectedNcr] = useState<NCR | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const loadData = useCallback(async () => {
    setViewState('loading');
    try {
      const [data, countData] = await Promise.all([
        qualityService.listNCRs(),
        qualityService.getNcrCounts(),
      ]);
      setNcrs(data);
      setFilteredNcrs(data);
      setCounts(countData);
      setViewState(data.length === 0 ? 'empty' : 'data');
    } catch {
      setErrorMessage(t('errors.generic'));
      setViewState('error');
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply filters
  useEffect(() => {
    let result = ncrs;

    if (filters.severity?.length) {
      result = result.filter((n) => filters.severity!.includes(n.severity));
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.ncrNumber.toLowerCase().includes(search) ||
          n.title.toLowerCase().includes(search) ||
          n.itemNumber.toLowerCase().includes(search)
      );
    }

    setFilteredNcrs(result);
  }, [filters, ncrs]);

  const handleStatusChange = async (ncrId: string, newStatus: NcrStatus) => {
    const result = await qualityService.updateNcrStatus(
      { ncrId, newStatus, comments: `Status changed to ${newStatus}` },
      mockUsers.qa_tech.id
    );

    if (result.success) {
      toast.success(`NCR status updated to ${newStatus}`);
      loadData();
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const handleViewDetails = (ncr: NCR) => {
    setSelectedNcr(ncr);
    setIsSheetOpen(true);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof NcrFilters] !== undefined
  );

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: t('pages.ncrCapa') },
  ];

  return (
    <div className="p-spacing-md lg:p-spacing-lg space-y-spacing-md">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-sm">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <h1 className="text-2xl font-bold text-text">NCR Board</h1>
        </div>

        {viewState === 'data' && (
          <div className="flex flex-wrap gap-spacing-sm text-sm">
            <span className="px-2 py-1 rounded bg-danger/10 text-danger font-medium">
              {counts.raised} Raised
            </span>
            <span className="px-2 py-1 rounded bg-warning/10 text-warning font-medium">
              {counts.disposition} Disposition
            </span>
            <span className="px-2 py-1 rounded bg-accent/10 text-accent font-medium">
              {counts.rework} Rework
            </span>
            <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">
              {counts.retest} Retest
            </span>
            <span className="px-2 py-1 rounded bg-success/10 text-success font-medium">
              {counts.closed} Closed
            </span>
          </div>
        )}
      </div>

      <PageCard>
        {/* Filters */}
        {viewState === 'data' && (
          <div className="flex flex-wrap items-center gap-spacing-sm mb-spacing-md">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder={t('common.search')}
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.severity?.[0] || 'all'}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  severity: value === 'all' ? undefined : [value as any],
                })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}

            <div className="flex items-center gap-2 text-sm text-text-muted ml-auto">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredNcrs.length} of {ncrs.length} NCRs
              </span>
            </div>
          </div>
        )}

        {viewState === 'loading' && (
          <div className="grid grid-cols-5 gap-spacing-md">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-spacing-sm">
                <Skeleton variant="text" className="h-10" />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ))}
          </div>
        )}

        {viewState === 'error' && (
          <ErrorBanner variant="error" message={errorMessage} onRetry={loadData} />
        )}

        {viewState === 'empty' && (
          <div className="text-center py-spacing-2xl">
            <AlertTriangle className="h-16 w-16 mx-auto text-text-muted mb-spacing-md" />
            <h3 className="text-lg font-medium text-text mb-spacing-xs">
              No NCRs found
            </h3>
            <p className="text-text-muted">
              There are no non-conformance reports at this time.
            </p>
          </div>
        )}

        {viewState === 'data' && (
          <NcrBoardComponent
            ncrs={filteredNcrs}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
          />
        )}
      </PageCard>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedNcr?.ncrNumber}</SheetTitle>
          </SheetHeader>

          {selectedNcr && (
            <div className="mt-spacing-lg space-y-spacing-lg">
              <div>
                <h3 className="font-semibold text-text">{selectedNcr.title}</h3>
                <p className="text-sm text-text-muted mt-1">{selectedNcr.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-spacing-md text-sm">
                <div>
                  <p className="text-text-muted">Severity</p>
                  <p className="font-medium capitalize">{selectedNcr.severity}</p>
                </div>
                <div>
                  <p className="text-text-muted">Status</p>
                  <p className="font-medium capitalize">{selectedNcr.status}</p>
                </div>
                <div>
                  <p className="text-text-muted">Item</p>
                  <p className="font-medium">{selectedNcr.itemNumber}</p>
                </div>
                <div>
                  <p className="text-text-muted">Quantity</p>
                  <p className="font-medium">{selectedNcr.quantity}</p>
                </div>
              </div>

              {selectedNcr.rootCause && (
                <div>
                  <p className="text-sm text-text-muted">Root Cause</p>
                  <p className="text-sm mt-1">{selectedNcr.rootCause}</p>
                </div>
              )}

              {selectedNcr.correctiveAction && (
                <div>
                  <p className="text-sm text-text-muted">Corrective Action</p>
                  <p className="text-sm mt-1">{selectedNcr.correctiveAction}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm text-text-muted mb-2">Audit Trail</h4>
                <div className="space-y-2">
                  {selectedNcr.auditTrail.map((entry) => (
                    <div
                      key={entry.id}
                      className="text-sm p-2 bg-muted rounded-radius-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{entry.action.replace(/_/g, ' ')}</span>
                        <span className="text-text-muted">
                          {format(new Date(entry.performedAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-text-muted">by {entry.performedByName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
