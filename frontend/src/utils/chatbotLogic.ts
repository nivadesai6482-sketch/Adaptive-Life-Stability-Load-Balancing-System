import { BurnoutRiskLevel } from './burnoutPredictor';
import { DomainScores } from './stabilityCalculator';

interface SystemData {
    lsi: number;
    burnoutRisk: BurnoutRiskLevel;
    energy: number;
    cognitiveLoad: number;
    domains: DomainScores;
}

export const getBotResponse = (userMessage: string, data: any): string => {
    const message = userMessage.toLowerCase();

    // Warm, human fallbacks for when the AI connection is interrupted
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
        return "Hey there. I'm here for you. I'm having a little trouble with my deep-thinking link right now, but I'm still listening. What's on your mind?";
    }

    return "I'm really sorry, but I'm finding it hard to connect to my thoughts right now... I want to give you my full attention. Could you try saying that again in a moment? I'm right here with you.";
};
