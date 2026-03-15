'use client'

import CameraFeed from '@/components/live-monitor/camera-feed'
import StatusBadge from '@/components/live-monitor/status-badge'
import MetricsPanel from '@/components/live-monitor/metrics-panel'
import DetectedIssues from '@/components/live-monitor/detected-issues'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { usePostureAnalyze } from '@/hooks/use-api'
import { useToast } from '@/components/ui/use-toast'

export default function LiveMonitorPage() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<any>(null)
  const { analyze } = usePostureAnalyze()
  const { toast } = useToast()

  const handleStartMonitoring = async () => {
    setIsLoading(true)
    console.log('[v0] Starting monitoring...')
    try {
      const result = await analyze()
      console.log('[v0] Analysis result:', result)
      
      if (result.success && result.data) {
        setIsMonitoring(true)
        setLastAnalysis(result.data)
        toast({
          title: 'Monitoring Started',
          description: `Posture Score: ${result.data.overallScore}`,
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to start monitoring. Check backend connection.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('[v0] Analysis failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to connect to analysis service',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopMonitoring = () => {
    setIsMonitoring(false)
    toast({
      title: 'Monitoring Stopped',
    })
  }

  const handleReset = () => {
    setLastAnalysis(null)
    toast({
      title: 'Analysis Reset',
    })
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Live Monitor</h1>
        <p className="text-lg text-muted-foreground">Real-time posture monitoring and analysis powered by AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CameraFeed />
          </Card>

          {/* Controls */}
          <Card className="p-5 flex items-center justify-between border-border/60">
            <StatusBadge status={isMonitoring ? 'monitoring' : 'idle'} />
            <div className="flex gap-2">
              {!isMonitoring ? (
                <Button 
                  onClick={handleStartMonitoring} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isLoading ? 'Analyzing...' : 'Start Monitoring'}
                </Button>
              ) : (
                <Button onClick={handleStopMonitoring} variant="outline" className="gap-2">
                  <Pause className="w-4 h-4" />
                  Stop
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" disabled={!lastAnalysis}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <MetricsPanel analysisData={lastAnalysis} />
          <DetectedIssues analysisData={lastAnalysis} />
        </div>
      </div>
    </div>
  )
}
