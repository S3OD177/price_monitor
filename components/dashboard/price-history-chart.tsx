'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartCard } from "./chart-card"

const data = [
    {
        date: "Jan 1",
        price: 120,
    },
    {
        date: "Jan 2",
        price: 122,
    },
    {
        date: "Jan 3",
        price: 118,
    },
    {
        date: "Jan 4",
        price: 125,
    },
    {
        date: "Jan 5",
        price: 125,
    },
    {
        date: "Jan 6",
        price: 130,
    },
    {
        date: "Jan 7",
        price: 128,
    },
]

export function PriceHistoryChart() {
    return (
        <ChartCard title="Price History" description="Average product price over time">
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
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
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    )
}
