'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartCard } from "./chart-card"

const data = [
    {
        date: "Jan 1",
        sales: 4000,
    },
    {
        date: "Jan 2",
        sales: 3000,
    },
    {
        date: "Jan 3",
        sales: 2000,
    },
    {
        date: "Jan 4",
        sales: 2780,
    },
    {
        date: "Jan 5",
        sales: 1890,
    },
    {
        date: "Jan 6",
        sales: 2390,
    },
    {
        date: "Jan 7",
        sales: 3490,
    },
]

export function SalesTrendChart() {
    return (
        <ChartCard title="Sales Trend" description="Daily sales volume">
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
