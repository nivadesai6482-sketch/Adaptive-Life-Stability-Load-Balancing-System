import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useStabilityStore } from '../../store/stabilityStore';

export const DomainInputForm = () => {
    const { currentScores, addDailyScore } = useStabilityStore();
    const [scores, setScores] = useState(currentScores);

    // Sync state when global scores change (e.g. after fetch)
    useEffect(() => {
        setScores(currentScores);
    }, [currentScores]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setScores((prev: DomainScores) => ({ ...prev, [name]: Number(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addDailyScore(scores);
    };

    const domains = [
        { key: 'Time', label: 'Time Capacity', color: 'blue' },
        { key: 'Energy', label: 'Physical Energy', color: 'red' },
        { key: 'Cognitive', label: 'Cognitive Load', color: 'indigo' },
        { key: 'Emotional', label: 'Emotional Bandwidth', color: 'pink' },
        { key: 'Financial', label: 'Financial Security', color: 'emerald' },
    ] as const;

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 overflow-hidden">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Update Capacity Metrics</h3>
                <p className="text-sm text-gray-500">Record your current stability scores for real-time assessment.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {domains.map(({ key, label }) => (
                    <div key={key}>
                        <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-700">
                            <label htmlFor={key}>{label}</label>
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{scores[key as keyof typeof scores]}/100</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                id={key}
                                name={key}
                                min="0"
                                max="100"
                                value={scores[key as keyof typeof scores]}
                                onChange={handleChange}
                                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${domains.find(d => d.key === key)?.color}-600`}
                            />
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 w-full justify-center sm:w-auto"
                    >
                        <Save className="h-4 w-4" />
                        Save Assessment
                    </button>
                </div>
            </form>
        </div>
    );
};
