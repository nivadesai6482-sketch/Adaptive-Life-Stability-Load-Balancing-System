import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useToast } from './toastStore';
import { API_ENDPOINTS } from '../config/apiConfig';
import { DomainScores, calculateLSI, mapHealthToEnergyScore } from '../utils/stabilityCalculator';
import { HealthData } from '../services/health/fitbitService'; // Reusing interface for now
import { fetchGoogleFitData } from '../services/health/googleFitService';
import { isGoogleFitConnected, initiateGoogleFitAuth, handleAuthRedirect } from '../services/health/googleFitAuth';
import { useEffect } from 'react';
import { calculateEnergyScoreMetrics } from '../utils/energyCalculator';

export interface DailyStabilityScore {
    date: string;
    score: number;
}

interface StabilityContextType {
    historicalScores: DailyStabilityScore[];
    currentScores: DomainScores;
    healthData: HealthData | null;
    isDeviceConnected: boolean;
    isConnecting: boolean;
    fetchHistoricalScores: () => Promise<void>;
    addDailyScore: (scores: DomainScores) => Promise<void>;
    updateLocalScores: (scores: DomainScores) => void;
    connectDevice: () => Promise<void>;
    disconnectDevice: () => Promise<void>;
}

const StabilityContext = createContext<StabilityContextType | undefined>(undefined);

export const StabilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [historicalScores, setHistoricalScores] = useState<DailyStabilityScore[]>([]);
    const [currentScores, setCurrentScores] = useState<DomainScores>({
        Time: 85,
        Energy: 60,
        Cognitive: 90,
        Emotional: 75,
        Financial: 80,
    });
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [isDeviceConnected, setIsDeviceConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const { addToast } = useToast();

    const fetchHistoricalScores = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_ENDPOINTS.STABILITY.BASE, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                const formatted = data
                    .filter((item: any) => item && item.createdAt && item.lifeStabilityIndex !== undefined)
                    .map((item: any) => ({
                        date: item.createdAt.split('T')[0],
                        score: item.lifeStabilityIndex
                    }));
                setHistoricalScores(formatted);

                if (data.length > 0) {
                    const latest = data[data.length - 1];
                    setCurrentScores({
                        Time: latest.timeScore || 85,
                        Energy: latest.energyScore || 60,
                        Cognitive: latest.cognitiveScore || 90,
                        Emotional: latest.emotionalScore || 75,
                        Financial: latest.financialScore || 80,
                    });
                }
            } else {
                const errorMessage = data?.message || 'Failed to retrieve historical stability data.';
                console.warn('Stability Fetch Warning:', errorMessage);
            }
        } catch (error) {
            console.error('Failed to fetch stability scores', error);
            addToast('Network error while plotting historical trends.', 'error');
        }
    }, [addToast]);

    const updateLocalScores = useCallback((scores: DomainScores) => {
        setCurrentScores(scores);
    }, []);

    const connectDevice = useCallback(async () => {
        if (!isGoogleFitConnected()) {
            initiateGoogleFitAuth();
            return;
        }

        setIsConnecting(true);
        try {
            const data = await fetchGoogleFitData();
            // data is an array of 7 days, we take the latest (today)
            const latest = data[data.length - 1];

            const healthMetrics: HealthData = {
                heartRate: latest.heartRateAverage || 70,
                sleepHours: 7.5, // Placeholder as Google Fit aggregate for sleep is complex
                activityLevel: latest.activeMinutes > 60 ? 'high' : latest.activeMinutes > 20 ? 'medium' : 'low',
                steps: latest.steps,
                lastSync: new Date().toISOString()
            };

            setHealthData(healthMetrics);
            setIsDeviceConnected(true);

            // Use the new numeric energy calculator
            const biologicalEnergy = calculateEnergyScoreMetrics(
                healthMetrics.heartRate,
                healthMetrics.steps,
                healthMetrics.activityLevel
            );

            setCurrentScores(prev => ({
                ...prev,
                Energy: biologicalEnergy
            }));

            addToast(`Google Fit telemetry synced. Bio-Energy score updated to ${biologicalEnergy}%.`, 'success');
        } catch (error: any) {
            setHealthData(null);
            setIsDeviceConnected(false);
            addToast(error.message || 'Could not fetch metrics from Google Fit.', 'error');
            console.error(error);
        } finally {
            setIsConnecting(false);
        }
    }, [addToast]);

    const disconnectDevice = useCallback(async () => {
        setIsConnecting(true);
        try {
            localStorage.removeItem("google_fit_access_token");
            setHealthData(null);
            setIsDeviceConnected(false);
            addToast('Health telemetry feed terminated.', 'success');
        } catch (error) {
            addToast('Failed to disconnect device.', 'error');
        } finally {
            setIsConnecting(false);
        }
    }, [addToast]);

    // Automatic sync and redirect handling on app load
    useEffect(() => {
        // Handle OAuth redirect hash
        if (window.location.hash.includes('access_token')) {
            const success = handleAuthRedirect();
            if (success) {
                addToast('Google Fit connected successfully!', 'success');
                connectDevice();
            }
        } else if (isGoogleFitConnected()) {
            connectDevice();
        }
    }, [connectDevice, addToast]); // Depend on memoized functions

    const addDailyScore = useCallback(async (scores: DomainScores) => {
        try {
            const token = localStorage.getItem('token');
            const lsi = calculateLSI(scores);

            const payload = {
                timeScore: scores.Time,
                energyScore: scores.Energy,
                cognitiveScore: scores.Cognitive,
                emotionalScore: scores.Emotional,
                financialScore: scores.Financial,
                lifeStabilityIndex: lsi
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
                setCurrentScores(scores);
                addToast('Stability assessment archived successfully.', 'success');
            } else {
                addToast(data.message || 'Failed to archive daily stability snapshot.', 'error');
            }
        } catch (error) {
            console.error('Failed to save stability score', error);
            addToast('Network drop while archiving daily metrics.', 'error');
        }
    }, [addToast]);

    return (
        <StabilityContext.Provider value={{
            historicalScores,
            currentScores,
            healthData,
            isDeviceConnected,
            isConnecting,
            fetchHistoricalScores,
            addDailyScore,
            updateLocalScores,
            connectDevice,
            disconnectDevice
        }}>
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
