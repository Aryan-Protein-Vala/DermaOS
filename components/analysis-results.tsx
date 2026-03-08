"use client"

import { useState, useEffect } from "react"
import { useSkinProfile } from "@/context/skin-profile-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Download, Sparkles, RefreshCw, Check, TrendingUp } from "lucide-react"
import { AIScannerModal } from "@/components/modals/ai-scanner-modal"

interface MetricScore {
    current: number
    predicted: number
}

interface SkinMetrics {
    oiliness: MetricScore
    hydration: MetricScore
    acne: MetricScore
    texture: MetricScore
    elasticity: MetricScore
    pigmentation: MetricScore
}

interface SkinAnalysis {
    skinType: string
    sensitivity: string
    concerns: string[]
    hydrationLevel: string
    oilLevel: string
    metrics?: SkinMetrics
    overallScore?: MetricScore
    amRoutine: { step: number; product: string; purpose: string }[]
    pmRoutine: { step: number; product: string; purpose: string }[]
    diet: { increase: string[]; avoid: string[] }
    lifestyleTips: string[]
    summary: string
}

// Metric bar component
function MetricBar({
    label,
    current,
    predicted,
    icon
}: {
    label: string
    current: number
    predicted: number
    icon?: string
}) {
    const improvement = predicted - current

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium flex items-center gap-1">
                    {icon && <span>{icon}</span>}
                    {label}
                </span>
                <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-muted-foreground">{current}</span>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-bold">{predicted}</span>
                </div>
            </div>
            <div className="relative h-4 bg-[#F0F0F0] rounded-full overflow-hidden">
                {/* Current value bar */}
                <div
                    className="absolute inset-y-0 left-0 bg-[#333] rounded-full transition-all duration-500"
                    style={{ width: `${current}%` }}
                />
                {/* Predicted value indicator */}
                <div
                    className="absolute inset-y-0 left-0 bg-green-400/40 rounded-full transition-all duration-500"
                    style={{ width: `${predicted}%` }}
                />
                {/* Current value line */}
                <div
                    className="absolute inset-y-0 w-0.5 bg-[#333] transition-all duration-500"
                    style={{ left: `${current}%` }}
                />
            </div>
            {improvement > 0 && (
                <p className="font-mono text-[10px] text-green-600">
                    +{improvement}% improvement in 4 weeks
                </p>
            )}
        </div>
    )
}

export function AnalysisResults() {
    const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null)
    const [loading, setLoading] = useState(true)
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const { hasPremium } = useSkinProfile()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated && hasPremium) {
            fetchAnalysis()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated, hasPremium])

    const fetchAnalysis = async () => {
        try {
            const res = await fetch('/api/user/skin-profile')
            if (res.ok) {
                const data = await res.json()
                if (data.skinProfile) {
                    setAnalysis(data.skinProfile)
                }
            }
        } catch (error) {
            console.error('Failed to fetch analysis:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadPDF = () => {
        if (!analysis) return

        // Create printable content with FULL details
        const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>DermaOS Skin Analysis Report</title>
  <style>
    body { font-family: 'Courier New', monospace; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; }
    h1 { font-size: 28px; margin-bottom: 8px; border-bottom: 3px solid #000; padding-bottom: 10px; }
    h2 { font-size: 18px; margin-top: 30px; margin-bottom: 12px; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
    h3 { font-size: 14px; margin-top: 16px; margin-bottom: 8px; }
    p { font-size: 12px; margin: 4px 0; line-height: 1.5; }
    .summary { background: #f5f5f5; padding: 16px; margin-bottom: 24px; border-left: 4px solid #000; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .box { border: 1px solid #e5e5e5; padding: 12px; }
    .label { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 16px; font-weight: bold; }
    .step { display: flex; gap: 12px; margin: 10px 0; padding: 10px; background: #fafafa; }
    .step-num { background: #000; color: #fff; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
    .step-content { flex: 1; }
    .step-product { font-weight: bold; font-size: 13px; }
    .step-purpose { color: #666; font-size: 11px; margin-top: 2px; }
    .increase { color: #16a34a; }
    .avoid { color: #dc2626; }
    .diet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .diet-box { padding: 15px; }
    .diet-box.increase { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .diet-box.avoid { background: #fef2f2; border: 1px solid #fecaca; }
    .tip { display: flex; align-items: center; gap: 8px; padding: 8px; background: #fafafa; margin: 6px 0; }
    .tip-check { color: #16a34a; font-weight: bold; }
    .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
    .metrics { margin: 20px 0; }
    .metric-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .metric-label { font-weight: bold; }
    .metric-values { display: flex; gap: 20px; }
    .metric-current { color: #666; }
    .metric-predicted { color: #16a34a; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🧬 DermaOS Skin Analysis Report</h1>
  <p style="color: #666; margin-bottom: 20px;">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  
  <div class="summary">
    <p style="font-size: 14px; margin: 0;">${analysis.summary}</p>
  </div>

  <h2>📊 Your Skin Profile</h2>
  <div class="grid">
    <div class="box">
      <p class="label">Skin Type</p>
      <p class="value">${analysis.skinType}</p>
    </div>
    <div class="box">
      <p class="label">Sensitivity</p>
      <p class="value">${analysis.sensitivity}</p>
    </div>
    <div class="box">
      <p class="label">Hydration Level</p>
      <p class="value">${analysis.hydrationLevel || 'Medium'}</p>
    </div>
    <div class="box">
      <p class="label">Oil Level</p>
      <p class="value">${analysis.oilLevel || 'Medium'}</p>
    </div>
  </div>

  <h3>Primary Concerns</h3>
  <p>${analysis.concerns?.join(', ') || 'None specified'}</p>

  ${analysis.metrics ? `
  <h2>📈 Skin Health Metrics (Current → 4 Week Prediction)</h2>
  <div class="metrics">
    <div class="metric-row">
      <span class="metric-label">💧 Oiliness Balance</span>
      <div class="metric-values">
        <span class="metric-current">${analysis.metrics.oiliness?.current || 0}/100</span>
        <span>→</span>
        <span class="metric-predicted">${analysis.metrics.oiliness?.predicted || 0}/100</span>
      </div>
    </div>
    <div class="metric-row">
      <span class="metric-label">💦 Hydration</span>
      <div class="metric-values">
        <span class="metric-current">${analysis.metrics.hydration?.current || 0}/100</span>
        <span>→</span>
        <span class="metric-predicted">${analysis.metrics.hydration?.predicted || 0}/100</span>
      </div>
    </div>
    <div class="metric-row">
      <span class="metric-label">✨ Acne Clarity</span>
      <div class="metric-values">
        <span class="metric-current">${analysis.metrics.acne?.current || 0}/100</span>
        <span>→</span>
        <span class="metric-predicted">${analysis.metrics.acne?.predicted || 0}/100</span>
      </div>
    </div>
    <div class="metric-row">
      <span class="metric-label">🪞 Texture</span>
      <div class="metric-values">
        <span class="metric-current">${analysis.metrics.texture?.current || 0}/100</span>
        <span>→</span>
        <span class="metric-predicted">${analysis.metrics.texture?.predicted || 0}/100</span>
      </div>
    </div>
    <div class="metric-row">
      <span class="metric-label">🔄 Elasticity</span>
      <div class="metric-values">
        <span class="metric-current">${analysis.metrics.elasticity?.current || 0}/100</span>
        <span>→</span>
        <span class="metric-predicted">${analysis.metrics.elasticity?.predicted || 0}/100</span>
      </div>
    </div>
    <div class="metric-row">
      <span class="metric-label">🎨 Even Tone</span>
      <div class="metric-values">
        <span class="metric-current">${analysis.metrics.pigmentation?.current || 0}/100</span>
        <span>→</span>
        <span class="metric-predicted">${analysis.metrics.pigmentation?.predicted || 0}/100</span>
      </div>
    </div>
  </div>
  ` : ''}

  <h2>☀️ Morning Routine</h2>
  ${analysis.amRoutine?.map(step => `
    <div class="step">
      <div class="step-num">${step.step}</div>
      <div class="step-content">
        <p class="step-product">${step.product}</p>
        <p class="step-purpose">${step.purpose}</p>
      </div>
    </div>
  `).join('') || '<p>No routine generated</p>'}

  <h2>🌙 Evening Routine</h2>
  ${analysis.pmRoutine?.map(step => `
    <div class="step">
      <div class="step-num">${step.step}</div>
      <div class="step-content">
        <p class="step-product">${step.product}</p>
        <p class="step-purpose">${step.purpose}</p>
      </div>
    </div>
  `).join('') || '<p>No routine generated</p>'}

  <h2>🥗 Diet Recommendations</h2>
  <div class="diet-grid">
    <div class="diet-box increase">
      <p style="font-weight: bold; color: #16a34a; margin-bottom: 10px;">✓ Foods to Increase</p>
      ${analysis.diet?.increase?.map(item => `<p>• ${item}</p>`).join('') || '<p>-</p>'}
    </div>
    <div class="diet-box avoid">
      <p style="font-weight: bold; color: #dc2626; margin-bottom: 10px;">✗ Foods to Avoid</p>
      ${analysis.diet?.avoid?.map(item => `<p>• ${item}</p>`).join('') || '<p>-</p>'}
    </div>
  </div>

  <h2>💡 Lifestyle Tips</h2>
  ${analysis.lifestyleTips?.map(tip => `
    <div class="tip">
      <span class="tip-check">✓</span>
      <span>${tip}</span>
    </div>
  `).join('') || '<p>No tips available</p>'}

  <div class="footer">
    <p><strong>DermaOS</strong> | AI-Powered Skin Analysis</p>
    <p style="margin-top: 10px;">This report is for informational purposes only. Consult a dermatologist for serious skin concerns.</p>
  </div>
</body>
</html>
    `

        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(printContent)
            printWindow.document.close()
            printWindow.print()
        }
    }

    const handleAnalysisComplete = (newAnalysis: SkinAnalysis) => {
        setAnalysis(newAnalysis)
    }

    // Default metrics if not provided by AI
    const getMetrics = (): SkinMetrics => {
        if (analysis?.metrics) return analysis.metrics
        return {
            oiliness: { current: 55, predicted: 75 },
            hydration: { current: 45, predicted: 70 },
            acne: { current: 60, predicted: 80 },
            texture: { current: 50, predicted: 72 },
            elasticity: { current: 65, predicted: 78 },
            pigmentation: { current: 58, predicted: 75 }
        }
    }

    const getOverallScore = () => {
        if (analysis?.overallScore) return analysis.overallScore
        const metrics = getMetrics()
        const currentAvg = Math.round(
            (metrics.oiliness.current + metrics.hydration.current + metrics.acne.current +
                metrics.texture.current + metrics.elasticity.current + metrics.pigmentation.current) / 6
        )
        const predictedAvg = Math.round(
            (metrics.oiliness.predicted + metrics.hydration.predicted + metrics.acne.predicted +
                metrics.texture.predicted + metrics.elasticity.predicted + metrics.pigmentation.predicted) / 6
        )
        return { current: currentAvg, predicted: predictedAvg }
    }

    if (loading) {
        return (
            <div className="p-6 border border-[#E5E5E5] bg-white">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        )
    }

    if (!analysis) {
        return (
            <>
                <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
                    <div className="text-center">
                        <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-mono text-lg font-bold mb-2">No Analysis Yet</h3>
                        <p className="font-mono text-sm text-muted-foreground mb-4">
                            Get your personalized skin analysis with AI
                        </p>
                        <Button
                            onClick={() => setIsScannerOpen(true)}
                            className="font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Start AI Analysis
                        </Button>
                    </div>
                </div>

                <AIScannerModal
                    isOpen={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onAnalysisComplete={handleAnalysisComplete}
                />
            </>
        )
    }

    const metrics = getMetrics()
    const overallScore = getOverallScore()

    return (
        <>
            <div className="space-y-6">
                {/* Header with actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">Analysis Complete</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadPDF}
                            className="font-mono text-xs rounded-none"
                        >
                            <Download className="w-4 h-4 mr-1" />
                            Full Report
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsScannerOpen(true)}
                            className="font-mono text-xs rounded-none"
                        >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Re-analyze
                        </Button>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="p-4 bg-gradient-to-r from-[#FAFAFA] to-[#F0F0F0] border border-[#E5E5E5]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-bold">Overall Skin Health</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-2xl font-bold">{overallScore.current}</span>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-mono text-2xl font-bold text-green-600">{overallScore.predicted}</span>
                        </div>
                    </div>
                    <div className="relative h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#333] to-[#555] rounded-full"
                            style={{ width: `${overallScore.current}%` }}
                        />
                        <div
                            className="absolute inset-y-0 left-0 bg-green-400/30 rounded-full"
                            style={{ width: `${overallScore.predicted}%` }}
                        />
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mt-2">
                        4-week prediction with recommended routine
                    </p>
                </div>

                {/* Skin Type & Concerns */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 font-mono text-xs bg-foreground text-background">
                        {analysis.skinType}
                    </span>
                    <span className="px-3 py-1 font-mono text-xs border border-[#E5E5E5]">
                        {analysis.sensitivity} Sensitivity
                    </span>
                    {analysis.concerns?.slice(0, 3).map((concern, i) => (
                        <span key={i} className="px-2 py-1 font-mono text-xs bg-[#F5F5F5]">
                            {concern}
                        </span>
                    ))}
                </div>

                {/* Metrics Bar Charts */}
                <div className="space-y-4 p-4 bg-white border border-[#E5E5E5]">
                    <h4 className="font-mono text-xs uppercase tracking-wide text-muted-foreground mb-4">
                        Skin Health Metrics — Current vs 4-Week Prediction
                    </h4>

                    <MetricBar
                        label="Oiliness Balance"
                        current={metrics.oiliness.current}
                        predicted={metrics.oiliness.predicted}
                        icon="💧"
                    />
                    <MetricBar
                        label="Hydration"
                        current={metrics.hydration.current}
                        predicted={metrics.hydration.predicted}
                        icon="💦"
                    />
                    <MetricBar
                        label="Acne Clarity"
                        current={metrics.acne.current}
                        predicted={metrics.acne.predicted}
                        icon="✨"
                    />
                    <MetricBar
                        label="Texture"
                        current={metrics.texture.current}
                        predicted={metrics.texture.predicted}
                        icon="🪞"
                    />
                    <MetricBar
                        label="Elasticity"
                        current={metrics.elasticity.current}
                        predicted={metrics.elasticity.predicted}
                        icon="🔄"
                    />
                    <MetricBar
                        label="Even Tone"
                        current={metrics.pigmentation.current}
                        predicted={metrics.pigmentation.predicted}
                        icon="🎨"
                    />
                </div>

                {/* CTA for full report */}
                <div className="p-4 bg-amber-50 border border-amber-200 text-center">
                    <p className="font-mono text-sm text-amber-800 mb-2">
                        Get your complete personalized routine, diet tips & lifestyle recommendations
                    </p>
                    <Button
                        onClick={handleDownloadPDF}
                        className="font-mono text-xs bg-amber-600 text-white hover:bg-amber-700 rounded-none"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Full Report (PDF)
                    </Button>
                </div>
            </div>

            <AIScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onAnalysisComplete={handleAnalysisComplete}
            />
        </>
    )
}
