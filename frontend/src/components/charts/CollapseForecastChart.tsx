import React, { useMemo } from 'react';
import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceArea,
    ReferenceLine
} from 'recharts';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { useStabilityStore } from '../../store/stabilityStore';
import { predictFutureStability } from '../../utils/stabilityPrediction';

export const CollapseForecastChart = () => {
    const { historicalScores } = useStabilityStore();

    // Number of days to look ahead
    const PREDICTION_DAYS = 14;
    const CRITICAL_THRESHOLD = 40;

    const { chartData, collapseWarningDate } = useMemo(() => {
        if (!historicalScores || historicalScores.length < 2) {
            return { chartData: [], collapseWarningDate: null };
        }

        const projected = predictFutureStability(historicalScores, PREDICTION_DAYS);

        let warningDate: string | null = null;

        // Combine data for ComposedChart:
        // { date, actualScore?: number, predictedScore?: number }

        const combined = historicalScores.map(entry => ({
            date: entry.date,
            actualScore: entry.score,
            predictedScore: null
        }));

        // To make the line connect smoothly, we inject the LAST historical point into the predicted series as well
        const lastHistorical = historicalScores[historicalScores.length - 1];

        projected.forEach(entry => {
            if (!warningDate && entry.score < CRITICAL_THRESHOLD) {
                warningDate = entry.date;
            }
            combined.push({
                date: entry.date,
                actualScore: null as any,
                predictedScore: entry.score
            });
        });

        // Add the connection point (a data point that has BOTH actual and predicted so the lines touch)
        const connectionPointIndex = historicalScores.length - 1;
        if (combined[connectionPointIndex]) {
            combined[connectionPointIndex].predictedScore = lastHistorical.score;
        }

        return {
            chartData: combined,
            collapseWarningDate: warningDate
        };

    }, [historicalScores]);

    if (historicalScores.length < 2) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96 flex flex-col items-center justify-center text-gray-500">
                <TrendingDown className="h-12 w-12 text-gray-300 mb-4" />
                <p>Insufficient historical data.</p>
                <p className="text-sm">Log at least 2 days of scores to generate a collapse forecast.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">System Collapse Forecast</h2>
                    <p className="text-sm text-gray-500 mt-1">14-Day Trajectory Projection</p>
                </div>
                {collapseWarningDate && (
                    <div className="flex bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-100 items-start max-w-sm">
                        <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Critical Warning</p>
                            <p className="text-xs mt-1">
                                Current load algorithms project structural integrity dropping below {CRITICAL_THRESHOLD} on or around <strong>{collapseWarningDate}</strong>. Immediate mitigation required.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                            // Show roughly every 3rd day to avoid crowding if we have 30+ points
                            minTickGap={30}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                            formatter={(value: number, name: string) => [
                                value,
                                name === 'actualScore' ? 'Actual LSI' : 'Projected LSI'
                            ]}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />

                        {/* Shaded Red Zone for Critical Area */}
                        <ReferenceArea
                            y1={0}
                            y2={CRITICAL_THRESHOLD}
                            fill="#FEE2E2"
                            fillOpacity={0.4}
                        />

                        {/* Red Line designating the boundary */}
                        <ReferenceLine
                            y={CRITICAL_THRESHOLD}
                            stroke="#EF4444"
                            strokeDasharray="3 3"
                            label={{ position: 'insideTopLeft', value: 'System Failure Threshold', fill: '#EF4444', fontSize: 12 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="actualScore"
                            name="Actual Score"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }}
                            activeDot={{ r: 6 }}
                            connectNulls={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="predictedScore"
                            name="14-Day Projection"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={{ r: 6 }}
                            connectNulls={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
