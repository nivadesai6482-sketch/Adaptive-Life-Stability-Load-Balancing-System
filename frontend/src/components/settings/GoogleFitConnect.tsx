import { Activity, CheckCircle2, Link as LinkIcon, Unlink, AlertCircle } from 'lucide-react';
import { initiateGoogleFitAuth, isGoogleFitConnected, disconnectGoogleFit } from '../../services/health/googleFitAuth';
import { useToast } from '../../store/toastStore';
import { useStabilityStore } from '../../store/stabilityStore';
import { useState, useEffect } from 'react'; // Added useState and useEffect imports

const GoogleFitConnect: React.FC = () => {
    const { isDeviceConnected } = useStabilityStore();
    const [connected, setConnected] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        // Sync local state with global connection status
        setConnected(isDeviceConnected || isGoogleFitConnected());
    }, [isDeviceConnected]);

    const handleConnect = () => {
        initiateGoogleFitAuth();
    };

    const handleDisconnect = () => {
        disconnectGoogleFit();
        setConnected(false);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Health Integration
            </h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Google Fit</p>
                        <p className="text-[10px] text-slate-500">Sync activity and heart rate data</p>
                    </div>
                    {connected ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">Connected</span>
                        </div>
                    ) : (
                        <div className="text-slate-500">
                            <span className="text-[10px] font-black uppercase tracking-tighter">Disconnected</span>
                        </div>
                    )}
                </div>

                {connected ? (
                    <button
                        onClick={handleDisconnect}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-rose-900/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-900/50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all group"
                    >
                        <Unlink className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        Disconnect Google Fit
                    </button>
                ) : (
                    <button
                        onClick={handleConnect}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
                    >
                        <LinkIcon className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        Connect Health App
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoogleFitConnect;
