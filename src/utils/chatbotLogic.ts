import { BurnoutRiskLevel } from './burnoutPredictor';
import { DomainScores } from './stabilityCalculator';

interface SystemData {
    lsi: number;
    burnoutRisk: BurnoutRiskLevel;
    energy: number;
    cognitiveLoad: number;
    domains: DomainScores;
}

export const getBotResponse = (userMessage: string, data: SystemData): string => {
    const message = userMessage.toLowerCase();

    // "What should I do" trigger
    if (message.includes('what should i do') || message.includes('recommendation') || message.includes('advice')) {
        const recs = [];

        // Priority 1: Burnout
        if (data.burnoutRisk === 'HIGH') {
            recs.push('🛑 UNRECOVERABLE LOAD: Immediate tactical rest is mandatory. Cease all high-intensity cognitive tasks.');
        } else if (data.burnoutRisk === 'MEDIUM') {
            recs.push('⚠️ CAUTION: Burnout risk is elevating. Schedule a 30-minute recovery window now.');
        }

        // Priority 2: Energy
        if (data.energy < 50) {
            recs.push('🔋 CRITICAL LOW ENERGY: Your bio-energy is below threshold. Prioritize hydration and a 15-minute power nap.');
        } else if (data.energy < 70) {
            recs.push('📉 DECLINING ENERGY: Optimize your next 2 hours for low-intensity administrative tasks.');
        }

        // Priority 3: Stability/Domains
        if (data.domains.Time < 60) {
            recs.push('⏳ TIME COMPRESSION: Your time domain is over-saturated. Defer all non-essential meetings.');
        }

        // Fallbacks if system is healthy
        if (recs.length < 3) {
            if (data.lsi > 85) recs.push('✅ OPERATIONAL EXCELLENCE: System is highly stable. Maintain current throughput.');
            else recs.push('🧩 EQUILIBRIUM: Focus on maintaining domain balance through incremental breaks.');

            if (recs.length < 3) recs.push('💧 HYDRATION: Ensure consistent water intake to maintain cognitive clarity.');
        }

        return `I've analyzed your real-time telemetry. Here are your top 3 tactical recommendations:\n\n1. ${recs[0]}\n2. ${recs[1] || 'Maintain current protocols.'}\n3. ${recs[2] || 'Monitor for changes.'}`;
    }

    // Burnout specific
    if (message.includes('burnout') || message.includes('stressed') || message.includes('tired')) {
        if (data.burnoutRisk === 'HIGH') {
            return "CRITICAL ALERT: Your burnout risk is categorized as HIGH. I strongly suggest reducing your active task load immediately and engaging in an off-line recovery protocol to prevent systemic collapse.";
        }
        if (data.burnoutRisk === 'MEDIUM') {
            return "Your stress levels are elevating into the MEDIUM risk zone. I recommend a preemptive break to stabilize your cognitive load.";
        }
        return "Your stress levels are currently within safe operational parameters. Maintain your current load-balancing strategy.";
    }

    // Energy specific
    if (message.includes('energy') || message.includes('sleep') || message.includes('exhausted')) {
        if (data.energy < 60) {
            return `Your current bio-energy is at ${data.energy}%. This indicates a need for sleep hygiene improvement. I suggest avoiding blue light and high-stimulus activities for the next 90 minutes.`;
        }
        return `Bio-energy is currently at ${data.energy}%, which is sufficient for your current workload. No immediate intervention required.`;
    }

    // Greeting / General
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
        return "Hello! I'm your ALS-LBS System Assistant. I monitor your stability telemetry in real-time. You can ask me for recommendations or about your current burnout and energy status.";
    }

    return "I've analyzed your stability telemetry. How specifically can I assist you with your life load balancing today? You can ask for recommendations based on your current state.";
};
