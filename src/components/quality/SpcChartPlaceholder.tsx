import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpcChart } from '@/types/quality';

interface SpcChartPlaceholderProps {
  chart: SpcChart;
}

export function SpcChartPlaceholder({ chart }: SpcChartPlaceholderProps) {
  const lastValue = chart.data[chart.data.length - 1]?.value || chart.target;
  const previousValue = chart.data[chart.data.length - 2]?.value || chart.target;
  const trend = lastValue > previousValue ? 'up' : lastValue < previousValue ? 'down' : 'stable';
  const inSpec = lastValue >= chart.lcl && lastValue <= chart.ucl;

  // Calculate simple stats
  const values = chart.data.map((d) => d.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const outOfSpec = chart.data.filter((d) => !d.inSpec).length;

  // Generate SVG path for the chart
  const width = 300;
  const height = 100;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minVal = Math.min(chart.lcl, ...values) - 0.1;
  const maxVal = Math.max(chart.ucl, ...values) + 0.1;
  const range = maxVal - minVal;

  const points = chart.data.map((d, i) => {
    const x = padding + (i / (chart.data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const uclY = padding + chartHeight - ((chart.ucl - minVal) / range) * chartHeight;
  const lclY = padding + chartHeight - ((chart.lcl - minVal) / range) * chartHeight;
  const targetY = padding + chartHeight - ((chart.target - minVal) / range) * chartHeight;

  return (
    <div className="p-spacing-md bg-surface rounded-radius-lg border border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-spacing-md">
        <div>
          <h3 className="font-semibold text-text">{chart.name}</h3>
          <p className="text-xs text-text-muted">
            {chart.parameter} ({chart.unit})
          </p>
        </div>
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
          inSpec ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
        )}>
          {trend === 'up' && <TrendingUp className="h-3 w-3" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3" />}
          {trend === 'stable' && <Minus className="h-3 w-3" />}
          {lastValue.toFixed(2)} {chart.unit}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mb-spacing-md">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Control limit lines */}
          <line
            x1={padding}
            y1={uclY}
            x2={width - padding}
            y2={uclY}
            stroke="currentColor"
            strokeDasharray="4,4"
            className="text-danger/50"
          />
          <line
            x1={padding}
            y1={lclY}
            x2={width - padding}
            y2={lclY}
            stroke="currentColor"
            strokeDasharray="4,4"
            className="text-danger/50"
          />
          <line
            x1={padding}
            y1={targetY}
            x2={width - padding}
            y2={targetY}
            stroke="currentColor"
            strokeDasharray="2,2"
            className="text-success/50"
          />

          {/* Data line */}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points={points}
            className="text-primary"
          />

          {/* Data points */}
          {chart.data.map((d, i) => {
            const x = padding + (i / (chart.data.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((d.value - minVal) / range) * chartHeight;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="currentColor"
                className={d.inSpec ? 'text-primary' : 'text-danger'}
              />
            );
          })}

          {/* Labels */}
          <text x={width - padding + 5} y={uclY + 4} fontSize="8" className="fill-danger">
            UCL
          </text>
          <text x={width - padding + 5} y={lclY + 4} fontSize="8" className="fill-danger">
            LCL
          </text>
          <text x={width - padding + 5} y={targetY + 4} fontSize="8" className="fill-success">
            Target
          </text>
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-spacing-sm text-center">
        <div>
          <p className="text-xs text-text-muted">Target</p>
          <p className="text-sm font-medium text-text">{chart.target}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Mean</p>
          <p className="text-sm font-medium text-text">{mean.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">UCL/LCL</p>
          <p className="text-sm font-medium text-text">{chart.ucl}/{chart.lcl}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Out of Spec</p>
          <p className={cn(
            'text-sm font-medium',
            outOfSpec > 0 ? 'text-danger' : 'text-success'
          )}>
            {outOfSpec}
          </p>
        </div>
      </div>
    </div>
  );
}
