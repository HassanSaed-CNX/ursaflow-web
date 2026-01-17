import { useState, useEffect, useCallback } from 'react';
import { Tag, Printer, Search, Plus, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageCard } from '@/components/ui/PageCard';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Skeleton } from '@/components/ui/CustomSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LabelPreview } from '@/components/packaging/LabelPreview';
import { PrintGateBanner } from '@/components/packaging/PrintGateBanner';
import { packagingService } from '@/services/packagingService';
import { labelPrintFormSchema, LabelPrintFormData } from '@/schemas/packagingSchema';
import { LabelTemplate, SerialRecord, PrintGateStatus } from '@/types/packaging';
import { useStrings } from '@/i18n/useStrings';
import { toast } from 'sonner';
import { format } from 'date-fns';

type ViewState = 'loading' | 'error' | 'empty' | 'data';

export function Serialization() {
  const { t } = useStrings();

  const [viewState, setViewState] = useState<ViewState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [serialRecords, setSerialRecords] = useState<SerialRecord[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate | null>(null);
  const [printGateStatus, setPrintGateStatus] = useState<PrintGateStatus | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected work order for print gate check
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState('WO-2024-001');

  const form = useForm<LabelPrintFormData>({
    resolver: zodResolver(labelPrintFormSchema),
    defaultValues: {
      serialNumber: '',
      mpn: '',
      templateId: '',
      copies: 1,
    },
  });

  const loadData = useCallback(async () => {
    setViewState('loading');
    try {
      const [templatesData, recordsData, gateStatus] = await Promise.all([
        packagingService.listLabelTemplates(),
        packagingService.listSerialRecords(),
        packagingService.getPrintGateStatus(selectedWorkOrderId),
      ]);
      setTemplates(templatesData);
      setSerialRecords(recordsData);
      setPrintGateStatus(gateStatus);
      setViewState(recordsData.length === 0 ? 'empty' : 'data');
    } catch {
      setErrorMessage(t('errors.generic'));
      setViewState('error');
    }
  }, [t, selectedWorkOrderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update selected template when templateId changes
  useEffect(() => {
    const templateId = form.watch('templateId');
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [form.watch('templateId'), templates]);

  const onSubmit = async (data: LabelPrintFormData) => {
    if (!printGateStatus?.canPrint) {
      toast.error('Cannot print: gates not passed');
      return;
    }

    setIsPrinting(true);
    try {
      const result = await packagingService.printLabel({
        serialRecordId: 'sr-new',
        templateId: data.templateId,
        copies: data.copies,
      });

      if (result.success) {
        toast.success(`Print job ${result.printJobId} submitted successfully`);
        form.reset();
        loadData();
      } else {
        toast.error(result.error || 'Print failed');
      }
    } catch {
      toast.error('Failed to submit print job');
    } finally {
      setIsPrinting(false);
    }
  };

  const filteredRecords = serialRecords.filter((r) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      r.serialNumber.toLowerCase().includes(search) ||
      r.mpn.toLowerCase().includes(search) ||
      r.itemDescription.toLowerCase().includes(search)
    );
  });

  const getStatusBadge = (status: SerialRecord['status']) => {
    const colors = {
      pending: 'bg-warning/10 text-warning border-warning/30',
      printed: 'bg-primary/10 text-primary border-primary/30',
      applied: 'bg-accent/10 text-accent border-accent/30',
      verified: 'bg-success/10 text-success border-success/30',
    };
    return (
      <Badge variant="outline" className={colors[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const previewData = {
    serialNumber: form.watch('serialNumber') || 'SN-XXXX-XXXXX',
    mpn: form.watch('mpn') || 'MPN-XXX-XXXXX',
    description: 'Product Description',
    mfgDate: format(new Date(), 'yyyy-MM-dd'),
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: t('pages.serialization') },
  ];

  return (
    <div className="p-spacing-md lg:p-spacing-lg space-y-spacing-md">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="flex items-center gap-spacing-sm">
        <Tag className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-text">{t('pages.serialization')}</h1>
      </div>

      {viewState === 'loading' && (
        <div className="grid lg:grid-cols-2 gap-spacing-md">
          <Skeleton variant="text" className="h-[400px]" />
          <Skeleton variant="text" className="h-[400px]" />
        </div>
      )}

      {viewState === 'error' && (
        <ErrorBanner variant="error" message={errorMessage} onRetry={loadData} />
      )}

      {(viewState === 'data' || viewState === 'empty') && printGateStatus && (
        <div className="grid lg:grid-cols-2 gap-spacing-lg">
          {/* Left: Print Form */}
          <div className="space-y-spacing-md">
            <PageCard>
              <h2 className="text-lg font-semibold text-text mb-spacing-md">
                {t('packaging.printLabel')}
              </h2>

              {/* Print Gate Banner */}
              <div className="mb-spacing-md">
                <PrintGateBanner status={printGateStatus} />
              </div>

              {/* Work Order Selector for Demo */}
              <div className="mb-spacing-md">
                <Label className="text-sm font-medium">{t('fields.workOrder')}</Label>
                <Select value={selectedWorkOrderId} onValueChange={setSelectedWorkOrderId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WO-2024-001">WO-2024-001 (Gates Blocked)</SelectItem>
                    <SelectItem value="WO-2024-002">WO-2024-002 (Gates Passed)</SelectItem>
                    <SelectItem value="WO-2024-003">WO-2024-003 (QC Pending)</SelectItem>
                    <SelectItem value="WO-2024-004">WO-2024-004 (Test Failed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Label Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-spacing-md">
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fields.serialNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SN-2024-XXXXX"
                            {...field}
                            disabled={!printGateStatus.canPrint}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* MPN # Field - Exact label as required */}
                  <FormField
                    control={form.control}
                    name="mpn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fields.mpn')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MPN-XXX-XXXXX"
                            {...field}
                            disabled={!printGateStatus.canPrint}
                            aria-label={t('fields.mpn')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fields.template')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!printGateStatus.canPrint}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('packaging.selectTemplate')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="copies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fields.copies')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            disabled={!printGateStatus.canPrint}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!printGateStatus.canPrint || isPrinting}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    {isPrinting ? 'Printing...' : t('packaging.printLabel')}
                  </Button>
                </form>
              </Form>
            </PageCard>
          </div>

          {/* Right: Preview + History */}
          <div className="space-y-spacing-md">
            {/* Label Preview */}
            <PageCard>
              <h2 className="text-lg font-semibold text-text mb-spacing-md">
                {t('packaging.labelPreview')}
              </h2>
              {selectedTemplate ? (
                <LabelPreview template={selectedTemplate} data={previewData} />
              ) : (
                <div className="text-center py-spacing-xl text-text-muted">
                  <Tag className="h-12 w-12 mx-auto mb-spacing-sm opacity-50" />
                  <p>Select a template to preview</p>
                </div>
              )}
            </PageCard>

            {/* Serial Records Table */}
            <PageCard>
              <div className="flex items-center justify-between mb-spacing-md">
                <h2 className="text-lg font-semibold text-text">Serial Records</h2>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <Input
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {filteredRecords.length === 0 ? (
                <div className="text-center py-spacing-lg text-text-muted">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-spacing-sm opacity-50" />
                  <p>{t('common.noResults')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('fields.serialNumber')}</TableHead>
                        <TableHead>{t('fields.mpn')}</TableHead>
                        <TableHead>{t('common.status')}</TableHead>
                        <TableHead>Printed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-sm">
                            {record.serialNumber}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {record.mpn}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="text-sm text-text-muted">
                            {record.labelPrintedAt
                              ? format(new Date(record.labelPrintedAt), 'MMM d, h:mm a')
                              : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </PageCard>
          </div>
        </div>
      )}
    </div>
  );
}
