import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from './toastStore';
import { API_ENDPOINTS } from '../config/apiConfig';

export interface DailyStabilityScore {
    date: string;
    score: number;
}

interface StabilityContextType {
    historicalScores: DailyStabilityScore[];
    fetchHistoricalScores: () => Promise<void>;
    addDailyScore: (score: number) => Promise<void>;
}

const StabilityContext = createContext<StabilityContextType | undefined>(undefined);

export const StabilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [historicalScores, setHistoricalScores] = useState<DailyStabilityScore[]>([]);
    const { addToast } = useToast();

    const fetchHistoricalScores = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_ENDPOINTS.STABILITY.BASE, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                // Map backend {_id, timeScore..., lifeStabilityIndex, createdAt} -> Frontend DailyStabilityScore
                const formatted = data.map((item: any) => ({
                    date: item.createdAt.split('T')[0],
                    score: item.lifeStabilityIndex
                }));
                // For rendering charts nicely, we might only want the last N days or keep all
                setHistoricalScores(formatted);
            } else {
                addToast(data.message || 'Failed to retrieve historical stability data.', 'error');
            }
        } catch (error) {
            console.error('Failed to fetch stability scores', error);
            addToast('Network error while plotting historical trends.', 'error');
        }
    };

    const addDailyScore = async (score: number) => {
        try {
            const token = localStorage.getItem('token');
            // For now, duplicate the overall score across domains to satisfy backend validation
            const payload = {
                timeScore: score,
                energyScore: score,
                cognitiveScore: score,
                emotionalScore: score,
                financialScore: score,
                lifeStabilityIndex: score
            };

            const res = await fetch(API_ENDPOINTS.STABILITY.BASE, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (res.ok) {
                const newEntry: DailyStabilityScore = {
                    date: data.createdAt.split('T')[0],
                    score: data.lifeStabilityIndex
                };
                setHistoricalScores(prev => [...prev, newEntry]);
            } else {
                addToast(data.message || 'Failed to archive daily stability snapshot.', 'error');
            }
        } catch (error) {
            console.error('Failed to save stability score', error);
            addToast('Network drop while archiving daily metrics.', 'error');
        }
    };

    return (
        <StabilityContext.Provider value={{ historicalScores, fetchHistoricalScores, addDailyScore }}>
            {children}
        </StabilityContext.Provider>
    );
};

export const useStabilityStore = () => {
    const context = useContext(StabilityContext);
    if (context === undefined) {
        throw new Error('useStabilityStore must be used within a StabilityProvider');
    }
    return context;
};
