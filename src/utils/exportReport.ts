import jsPDF from 'jspdf';

interface ExportData {
    lsi: number;
    burnoutRisk: string;
    healthData?: {
        sleepHours: number;
        heartRate: number;
    };
    recommendations: string[];
    userName: string;
}

export const exportReport = (data: ExportData) => {
    const doc = new jsPDF();
    const primaryColor = '#4f46e5'; // Indigo-600

    // Header Decoration
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('ALS-LBS SYSTEM REPORT', 20, 25);

    // User Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`ANALYTIC RECORD FOR: ${data.userName.toUpperCase()}`, 20, 34);

    // Metadata
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.setFontSize(9);
    doc.text(`REPORT ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 150, 48);
    doc.text(`GENERATED: ${new Date().toLocaleString()}`, 150, 53);

    // Line separator
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(20, 55, 190, 55);

    // 1. Life Stability Index (LSI)
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Life Stability Index (LSI)', 20, 70);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Target Operating Range: 75.0 - 100.0', 25, 78);

    // Draw score box
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(25, 82, 50, 20, 2, 2, 'FD');

    doc.setTextColor(primaryColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(data.lsi.toFixed(1), 35, 95);
    doc.setFontSize(10);
    doc.text('/ 100', 52, 95);

    // 2. Burnout Risk Assessment
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text('2. Burnout Risk Assessment', 20, 115);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Probability of systemic exhaustion identified as:`, 25, 123);

    const riskColor = data.burnoutRisk === 'HIGH' ? '#e11d48' : (data.burnoutRisk === 'MEDIUM' ? '#f59e0b' : '#10b981');
    doc.setTextColor(riskColor);
    doc.setFont('helvetica', 'bold');
    doc.text(data.burnoutRisk, 110, 123);

    // 3. Biometric Telemetry (if available)
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text('3. Biometric Telemetry', 20, 145);

    if (data.healthData) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Restorative Sleep Buffer: ${data.healthData.sleepHours} Hours`, 25, 155);
        doc.text(`• Resting Heart Rate Baseline: ${data.healthData.heartRate} BPM`, 25, 162);
    } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.text('External device synchronization inactive for this period.', 25, 155);
    }

    // 4. System Recommendations
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Core Optimization Protocols', 20, 185);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.recommendations.forEach((rec, index) => {
        const splitText = doc.splitTextToSize(`• ${rec}`, 165);
        doc.text(splitText, 25, 195 + (index * 12));
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('ALS-LBS Autonomous Intelligence Unit | Proprietary Diagnostic Documentation', 20, 280);
    doc.text('Page 1 of 1', 180, 280);

    doc.save(`ALS_LBS_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
