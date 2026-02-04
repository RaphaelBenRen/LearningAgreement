import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface WebhookPayload {
  event: string
  application_id: string
  message_preview?: string
}

export async function POST(request: Request) {
  try {
    const body: WebhookPayload = await request.json()
    const { event, application_id } = body

    const supabase = await createClient()

    // Récupérer les infos de l'application
    const { data: application } = await supabase
      .from('applications')
      .select(`
        *,
        student:profiles!applications_student_id_fkey(*),
        major_head:profiles!applications_major_head_id_fkey(*)
      `)
      .eq('id', application_id)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Récupérer les profils du service international
    const { data: internationalProfiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'international')

    // Construire le payload pour n8n
    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: {
        application_id,
        status: application.status,
        university: {
          name: application.university_name,
          city: application.university_city,
          country: application.university_country,
        },
        student: {
          name: (application.student as { full_name: string })?.full_name,
          email: (application.student as { email: string })?.email,
        },
        major_head: {
          name: (application.major_head as { full_name: string })?.full_name,
          email: (application.major_head as { email: string })?.email,
        },
        international_emails: internationalProfiles?.map((p) => p.email) || [],
      },
    }

    // Envoyer au webhook n8n si configuré
    const webhookUrl = process.env.WEBHOOK_N8N_URL
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })

        if (!response.ok) {
          console.error('Webhook n8n error:', response.status)
        }
      } catch (error) {
        console.error('Failed to send webhook to n8n:', error)
      }
    }

    return NextResponse.json({
      success: true,
      event,
      payload: webhookPayload,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Endpoint GET pour tester la configuration
export async function GET() {
  const webhookUrl = process.env.WEBHOOK_N8N_URL

  return NextResponse.json({
    configured: !!webhookUrl,
    events: [
      'application_submitted',
      'application_validated_major',
      'application_validated_final',
      'application_rejected',
      'new_message',
    ],
  })
}
