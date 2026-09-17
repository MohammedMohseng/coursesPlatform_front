"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type DashboardChartDatum = Record<
  string,
  string | number | null | undefined
>;

export type DashboardChartType = "bar" | "line" | "area" | "pie";

export type DashboardChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

export interface DashboardChartProps {
  title: string;
  description?: string;
  type?: DashboardChartType;
  data: DashboardChartDatum[];
  dataKeys: string[];
  config: DashboardChartConfig;
  xKey: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
  summary?: Array<{
    label: string;
    value: string | number;
  }>;
}

const numberFormatter = new Intl.NumberFormat("en-US");

function formatValue(value: number | string) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return numberFormatter.format(numericValue);
}

export function DashboardChart({
  title,
  description,
  type = "bar",
  data,
  dataKeys,
  config,
  xKey,
  className,
  height = 280,
  showLegend = true,
  summary,
}: DashboardChartProps) {
  if (!data.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
          لا توجد بيانات كافية لعرض الرسم البياني.
        </CardContent>
      </Card>
    );
  }

  const emptySeries = dataKeys.filter((key) => key && config[key]);

  const chartContent = () => {
    if (type === "pie") {
      const pieData = data.map((item, index) => {
        const value = Number(item[dataKeys[0]] ?? 0);

        return {
          name: String(item[xKey] ?? `item-${index}`),
          value,
          fill: config[dataKeys[0]]?.color ?? "#64748b",
        };
      });

      return (
        <ChartContainer config={config} className="h-full w-full" style={{ height }}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={88}
              paddingAngle={3}
            >
              {pieData.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={(label) => String(label ?? "")} />}
            />
            {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
          </PieChart>
        </ChartContainer>
      );
    }

    const sharedChartProps = {
      data,
      margin: { top: 8, right: 12, left: 12, bottom: 8 },
    };

    const axisCommon = {
      tickLine: false,
      axisLine: false,
      tickMargin: 8,
    } as const;

    const renderSeries = () =>
      emptySeries.map((key, index) => {
        const stroke = config[key]?.color ?? ["#3b82f6", "#22c55e", "#f59e0b", "#a78bfa"][index % 4];

        if (type === "line") {
          return (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={stroke}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          );
        }

        if (type === "area") {
          return (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={stroke}
              fill={stroke}
              fillOpacity={0.18}
              strokeWidth={2.5}
            />
          );
        }

        return (
          <Bar
            key={key}
            dataKey={key}
            fill={stroke}
            radius={[8, 8, 0, 0]}
            maxBarSize={52}
          />
        );
      });

    const chart =
      type === "line" ? (
        <LineChart {...sharedChartProps}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey={xKey} {...axisCommon} />
          <YAxis {...axisCommon} />
          <ChartTooltip
            cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
            content={<ChartTooltipContent labelFormatter={(label) => String(label ?? "")} />}
          />
          {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
          {renderSeries()}
        </LineChart>
      ) : type === "area" ? (
        <AreaChart {...sharedChartProps}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey={xKey} {...axisCommon} />
          <YAxis {...axisCommon} />
          <ChartTooltip
            cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
            content={<ChartTooltipContent labelFormatter={(label) => String(label ?? "")} />}
          />
          {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
          {renderSeries()}
        </AreaChart>
      ) : (
        <BarChart {...sharedChartProps}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey={xKey} {...axisCommon} />
          <YAxis {...axisCommon} />
          <ChartTooltip
            cursor={{ fill: "rgba(148,163,184,0.12)" }}
            content={<ChartTooltipContent labelFormatter={(label) => String(label ?? "")} />}
          />
          {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
          {renderSeries()}
        </BarChart>
      );

    return (
      <ChartContainer config={config} className="h-full w-full" style={{ height }}>
        {chart}
      </ChartContainer>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>

          {summary?.length ? (
            <div className="flex flex-wrap gap-2">
              {summary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border bg-muted/30 px-2.5 py-1.5 text-xs"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <div className="font-semibold text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>{chartContent()}</CardContent>
    </Card>
  );
}

export default DashboardChart;
