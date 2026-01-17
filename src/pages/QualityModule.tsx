import { useState, useEffect, useCallback } from 'react';
import { ClipboardCheck, Package, Settings, CheckSquare, BarChart3 } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageCard } from '@/components/ui/PageCard';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Skeleton, SkeletonTable } from '@/components/ui/CustomSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InspectionTable } from '@/components/quality/InspectionTable';
import { FinalQcSignOffModal } from '@/components/quality/FinalQcSignOffModal';
import { SpcChartPlaceholder } from '@/components/quality/SpcChartPlaceholder';
import { qualityService } from '@/services/qualityService';
import { Inspection, SpcChart } from '@/types/quality';
import { FinalQcSignOffData } from '@/schemas/qualitySchema';
import { useStrings } from '@/i18n/useStrings';
import { toast } from 'sonner';
import { mockUsers } from '@/mocks/users';

type ViewState = 'loading' | 'error' | 'empty' | 'data';

export function QualityModule() {
  const { t } = useStrings();
  const [activeTab, setActiveTab] = useState('incoming');

  // Inspections state
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // SPC Charts
  const [spcCharts, setSpcCharts] = useState<SpcChart[]>([]);

  // Sign-off modal
  const [signOffModal, setSignOffModal] = useState<{
    open: boolean;
    inspection: Inspection | null;
  }>({ open: false, inspection: null });

  // Load data based on active tab
  const loadData = useCallback(async () => {
    setViewState('loading');
    try {
      if (activeTab === 'spc') {
        const charts = await qualityService.getSpcCharts();
        setSpcCharts(charts);
        setViewState(charts.length === 0 ? 'empty' : 'data');
      } else {
        const type = activeTab === 'incoming' ? 'incoming' : 
                     activeTab === 'in_process' ? 'in_process' : 'final';
        const data = await qualityService.listInspections({ type });
        setInspections(data);
        setViewState(data.length === 0 ? 'empty' : 'data');
      }
    } catch {
      setErrorMessage(t('errors.generic'));
      setViewState('error');
    }
  }, [activeTab, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSignOff = (inspection: Inspection) => {
    setSignOffModal({ open: true, inspection });
  };

  const handleSignOffSubmit = async (data: FinalQcSignOffData): Promise<{ success: boolean; error?: string }> => {
    const result = await qualityService.signOffInspection(data, mockUsers.qa_tech.id);
    if (result.success) {
      toast.success('Inspection signed off successfully');
      loadData();
    }
    return result;
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Quality' },
  ];

  const tabConfig = [
    { id: 'incoming', label: 'Incoming', icon: Package },
    { id: 'in_process', label: 'In-Process', icon: Settings },
    { id: 'final', label: 'Final QC', icon: CheckSquare },
    { id: 'spc', label: 'SPC Charts', icon: BarChart3 },
  ];

  return (
    <div className="p-spacing-md lg:p-spacing-lg space-y-spacing-md">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="flex items-center gap-spacing-sm">
        <ClipboardCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-text">Quality Inspections</h1>
      </div>

      <PageCard>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-spacing-md">
            {tabConfig.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Loading State */}
          {viewState === 'loading' && (
            <div className="space-y-spacing-md">
              <Skeleton variant="text" className="h-8 w-48" />
              <SkeletonTable rows={5} />
            </div>
          )}

          {/* Error State */}
          {viewState === 'error' && (
            <ErrorBanner variant="error" message={errorMessage} onRetry={loadData} />
          )}

          {/* Empty State */}
          {viewState === 'empty' && (
            <div className="text-center py-spacing-2xl">
              <ClipboardCheck className="h-16 w-16 mx-auto text-text-muted mb-spacing-md" />
              <h3 className="text-lg font-medium text-text mb-spacing-xs">
                No {activeTab === 'spc' ? 'SPC charts' : 'inspections'} found
              </h3>
              <p className="text-text-muted">
                {activeTab === 'spc' 
                  ? 'No SPC data available at this time.'
                  : 'No inspections are pending for this category.'}
              </p>
            </div>
          )}

          {/* Data State */}
          {viewState === 'data' && (
            <>
              <TabsContent value="incoming" className="mt-0">
                <InspectionTable 
                  inspections={inspections} 
                  onSignOff={handleSignOff}
                  showSignOff={true}
                />
              </TabsContent>

              <TabsContent value="in_process" className="mt-0">
                <InspectionTable 
                  inspections={inspections}
                  onSignOff={handleSignOff}
                  showSignOff={true}
                />
              </TabsContent>

              <TabsContent value="final" className="mt-0">
                <InspectionTable 
                  inspections={inspections}
                  onSignOff={handleSignOff}
                  showSignOff={true}
                />
              </TabsContent>

              <TabsContent value="spc" className="mt-0">
                <div className="grid gap-spacing-md md:grid-cols-2">
                  {spcCharts.map((chart) => (
                    <SpcChartPlaceholder key={chart.id} chart={chart} />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </PageCard>

      {/* Sign-off Modal */}
      <FinalQcSignOffModal
        isOpen={signOffModal.open}
        onClose={() => setSignOffModal({ open: false, inspection: null })}
        inspection={signOffModal.inspection}
        onSubmit={handleSignOffSubmit}
      />
    </div>
  );
}
