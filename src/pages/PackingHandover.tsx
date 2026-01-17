import { useState, useEffect, useCallback } from 'react';
import { Archive, FileText, Package, Clock, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageCard } from '@/components/ui/PageCard';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Skeleton, SkeletonCard } from '@/components/ui/CustomSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PackChecklistComponent } from '@/components/packaging/PackChecklist';
import { AgingPanel } from '@/components/packaging/AgingPanel';
import { PrintGateBanner } from '@/components/packaging/PrintGateBanner';
import { packagingService } from '@/services/packagingService';
import {
  PackChecklist,
  DocumentBundle,
  PrintGateStatus,
  SparesAgingItem,
} from '@/types/packaging';
import { useStrings } from '@/i18n/useStrings';
import { toast } from 'sonner';
import { mockUsers } from '@/mocks/users';

type ViewState = 'loading' | 'error' | 'empty' | 'data';

const documentTypeLabels: Record<string, string> = {
  coc: 'Certificate of Conformance',
  test_report: 'Test Report',
  ppap: 'PPAP Documentation',
  fair: 'First Article Inspection Report',
  packing_list: 'Packing List',
};

const documentStatusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/30',
  generated: 'bg-primary/10 text-primary border-primary/30',
  reviewed: 'bg-accent/10 text-accent border-accent/30',
  approved: 'bg-success/10 text-success border-success/30',
};

export function PackingHandover() {
  const { t } = useStrings();

  const [viewState, setViewState] = useState<ViewState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState('WO-2024-001');
  const [checklist, setChecklist] = useState<PackChecklist | null>(null);
  const [documentBundle, setDocumentBundle] = useState<DocumentBundle | null>(null);
  const [printGateStatus, setPrintGateStatus] = useState<PrintGateStatus | null>(null);
  const [agingItems, setAgingItems] = useState<SparesAgingItem[]>([]);
  const [agingCounts, setAgingCounts] = useState<Record<SparesAgingItem['status'], number>>({
    active: 0,
    warning: 0,
    critical: 0,
    expired: 0,
  });

  const loadData = useCallback(async () => {
    setViewState('loading');
    try {
      const [checklistData, bundleData, gateStatus, aging, counts] = await Promise.all([
        packagingService.getPackChecklist(selectedWorkOrderId),
        packagingService.getDocumentBundle(selectedWorkOrderId),
        packagingService.getPrintGateStatus(selectedWorkOrderId),
        packagingService.listSparesAging(),
        packagingService.getSparesAgingCounts(),
      ]);
      setChecklist(checklistData);
      setDocumentBundle(bundleData);
      setPrintGateStatus(gateStatus);
      setAgingItems(aging);
      setAgingCounts(counts);
      setViewState('data');
    } catch {
      setErrorMessage(t('errors.generic'));
      setViewState('error');
    }
  }, [t, selectedWorkOrderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChecklistItemToggle = async (itemId: string, checked: boolean) => {
    if (!checklist) return;

    const result = await packagingService.updateChecklistItem(
      checklist.id,
      itemId,
      checked,
      mockUsers.packaging.id
    );

    if (result.success) {
      toast.success(checked ? 'Item completed' : 'Item unchecked');
      loadData();
    } else {
      toast.error(result.error || 'Failed to update item');
    }
  };

  const handleGenerateDocument = async (documentId: string) => {
    if (!documentBundle) return;

    const result = await packagingService.generateDocument(documentBundle.id, documentId);
    if (result.success) {
      toast.success('Document generated successfully');
      loadData();
    } else {
      toast.error(result.error || 'Failed to generate document');
    }
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: t('pages.packingHandover') },
  ];

  return (
    <div className="p-spacing-md lg:p-spacing-lg space-y-spacing-md">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md">
        <div className="flex items-center gap-spacing-sm">
          <Archive className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-text">{t('pages.packingHandover')}</h1>
        </div>

        {/* Work Order Selector */}
        <div className="flex items-center gap-spacing-sm">
          <Label className="text-sm font-medium whitespace-nowrap">
            {t('fields.workOrder')}:
          </Label>
          <Select value={selectedWorkOrderId} onValueChange={setSelectedWorkOrderId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WO-2024-001">WO-2024-001</SelectItem>
              <SelectItem value="WO-2024-002">WO-2024-002</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewState === 'loading' && (
        <div className="grid lg:grid-cols-3 gap-spacing-md">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {viewState === 'error' && (
        <ErrorBanner variant="error" message={errorMessage} onRetry={loadData} />
      )}

      {viewState === 'data' && (
        <div className="grid lg:grid-cols-3 gap-spacing-lg">
          {/* Left Column: Checklist */}
          <div className="lg:col-span-2 space-y-spacing-md">
            {/* Print Gate Status */}
            {printGateStatus && (
              <PageCard>
                <h2 className="text-lg font-semibold text-text mb-spacing-md">
                  Readiness Status
                </h2>
                <PrintGateBanner status={printGateStatus} />
              </PageCard>
            )}

            {/* Pack Checklist */}
            {checklist ? (
              <PageCard>
                <PackChecklistComponent
                  checklist={checklist}
                  onItemToggle={handleChecklistItemToggle}
                  disabled={checklist.status === 'completed'}
                />
              </PageCard>
            ) : (
              <PageCard>
                <div className="text-center py-spacing-lg text-text-muted">
                  <Package className="h-12 w-12 mx-auto mb-spacing-sm opacity-50" />
                  <p>No checklist found for this work order</p>
                </div>
              </PageCard>
            )}

            {/* Document Bundle */}
            <PageCard>
              <div className="flex items-center gap-spacing-sm mb-spacing-md">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-text">
                  {t('packaging.documents.title')}
                </h2>
                {documentBundle?.isComplete && (
                  <Badge className="bg-success text-white ml-auto">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>

              {documentBundle ? (
                <div className="space-y-spacing-sm">
                  {documentBundle.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-spacing-sm bg-muted/50 rounded-radius-sm"
                    >
                      <div className="flex items-center gap-spacing-sm">
                        <FileText className="h-4 w-4 text-text-muted" />
                        <div>
                          <p className="font-medium text-sm text-text">{doc.name}</p>
                          <p className="text-xs text-text-muted">
                            {documentTypeLabels[doc.type]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-spacing-sm">
                        <Badge
                          variant="outline"
                          className={documentStatusColors[doc.status]}
                        >
                          {doc.status.toUpperCase()}
                        </Badge>
                        {doc.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateDocument(doc.id)}
                          >
                            Generate
                          </Button>
                        )}
                        {doc.url && (
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-spacing-lg text-text-muted">
                  <FileText className="h-8 w-8 mx-auto mb-spacing-sm opacity-50" />
                  <p>No document bundle found</p>
                </div>
              )}
            </PageCard>
          </div>

          {/* Right Column: AGING Panel */}
          <div className="space-y-spacing-md">
            {/* AGING Panel with exact label */}
            <AgingPanel items={agingItems} counts={agingCounts} />

            {/* Completion Summary */}
            <PageCard>
              <div className="flex items-center gap-spacing-sm mb-spacing-md">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-text">Summary</h3>
              </div>

              <div className="space-y-spacing-sm text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Checklist Status</span>
                  <Badge
                    variant="outline"
                    className={
                      checklist?.status === 'completed'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }
                  >
                    {checklist?.status?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Documents</span>
                  <span className="font-medium">
                    {documentBundle?.documents.filter((d) => d.status === 'approved').length || 0}
                    /{documentBundle?.documents.length || 0} Approved
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Print Gate</span>
                  <Badge
                    variant="outline"
                    className={
                      printGateStatus?.canPrint
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }
                  >
                    {printGateStatus?.canPrint ? 'PASSED' : 'BLOCKED'}
                  </Badge>
                </div>
              </div>

              <Button
                className="w-full mt-spacing-md"
                disabled={
                  !printGateStatus?.canPrint ||
                  checklist?.status !== 'completed' ||
                  !documentBundle?.isComplete
                }
              >
                <Archive className="h-4 w-4 mr-2" />
                Complete Handover
              </Button>
            </PageCard>
          </div>
        </div>
      )}
    </div>
  );
}
