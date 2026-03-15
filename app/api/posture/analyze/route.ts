import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
const BACKEND_TIMEOUT = 5000 // 5 second timeout

// Mock data to return when backend is unavailable
const getMockAnalysisData = (body: any) => ({
  success: true,
  data: {
    timestamp: new Date().toISOString(),
    neckAngle: body.neck_angle ?? 10,
    spineAlignment: Math.floor(Math.random() * 30) + 70, // 70-100
    shoulderLevel: body.shoulder_alignment ?? 5,
    overallScore: Math.floor(Math.random() * 30) + 70,
    status: Math.random() > 0.3 ? 'good' : 'fair',
    detectedIssues: {
      slouching: Math.random() > 0.7,
      neckStrain: Math.random() > 0.8,
      unevenShoulders: Math.random() > 0.8,
    },
    detected_issues: ['Keep your back straight'],
    suggested_fixes: ['Adjust monitor height', 'Maintain straight posture'],
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[v0] Analyze request received:', { BACKEND, body })

    // Try to connect to backend with timeout
    let res
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT)

      res = await fetch(`${BACKEND}/api/posture/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          neck_angle: body.neck_angle ?? 10,
          back_angle: body.back_angle ?? 10,
          shoulder_alignment: body.shoulder_alignment ?? 5,
          sitting_duration_minutes: body.sitting_duration_minutes ?? 30,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        console.warn('[v0] Backend response error:', res.status)
        return NextResponse.json(getMockAnalysisData(body))
      }

      const data = await res.json()
      console.log('[v0] Backend response:', data)

      // Normalize to shape frontend expects
      return NextResponse.json({
        success: true,
        data: {
          timestamp: new Date().toISOString(),
          neckAngle: body.neck_angle ?? 10,
          spineAlignment: data.correction_score ?? 80,
          shoulderLevel: body.shoulder_alignment ?? 5,
          overallScore: data.correction_score ?? 80,
          status: data.posture_status?.toLowerCase().includes('good') ? 'good' : 'fair',
          detectedIssues: {
            slouching: data.detected_issues?.some((i: string) => i.toLowerCase().includes('slouch')) ?? false,
            neckStrain: data.detected_issues?.some((i: string) => i.toLowerCase().includes('neck')) ?? false,
            unevenShoulders: data.detected_issues?.some((i: string) => i.toLowerCase().includes('shoulder')) ?? false,
          },
          detected_issues: data.detected_issues ?? [],
          suggested_fixes: data.suggested_fixes ?? [],
        },
      })
    } catch (fetchError: any) {
      const errorCode = fetchError?.code || fetchError?.name || 'UNKNOWN'
      console.warn(`[v0] Backend unavailable (${errorCode}), using mock data`)
      return NextResponse.json(getMockAnalysisData(body))
    }
  } catch (error) {
    console.error('[v0] Analyze endpoint error:', error)
    return NextResponse.json(getMockAnalysisData({}), { status: 500 })
  }
}
