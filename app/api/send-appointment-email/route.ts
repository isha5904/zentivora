import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const ADMIN_EMAIL = 'ishapatharia2004@gmail.com'

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const {
      userEmail,
      petName,
      petBreed,
      petAge,
      serviceName,
      servicePrice,
      serviceDuration,
      groomerName,
      date,
      time,
      notes,
      appointmentId,
    } = body

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const { error } = await resend.emails.send({
      from: 'Zentivora <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New Booking: ${petName} — ${serviceName} on ${formattedDate}`,
      html: buildEmailHtml({
        userEmail,
        petName,
        petBreed,
        petAge,
        serviceName,
        servicePrice,
        serviceDuration,
        groomerName,
        formattedDate,
        time: String(time).slice(0, 5),
        notes,
        appointmentId,
      }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email route error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

function buildEmailHtml(data: {
  userEmail: string
  petName: string
  petBreed: string
  petAge: string
  serviceName: string
  servicePrice: number
  serviceDuration: number
  groomerName: string
  formattedDate: string
  time: string
  notes: string
  appointmentId: string
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Appointment Booking — Zentivora</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f97316,#f59e0b);padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                Zenti<span style="color:#fed7aa;">vora</span>
              </p>
              <p style="margin:8px 0 0;font-size:14px;color:#fef3c7;font-weight:500;letter-spacing:0.5px;">
                NEW APPOINTMENT BOOKING
              </p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#fff7ed;border-left:4px solid #f97316;padding:16px 40px;">
              <p style="margin:0;font-size:15px;color:#9a3412;font-weight:600;">
                &#128276; A new appointment has been booked and requires your review.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Customer -->
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Customer</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                <tr>
                  <td style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Email:</strong> ${data.userEmail}
                  </td>
                </tr>
              </table>

              <!-- Pet Details -->
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Pet Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                <tr>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Name:</strong> ${data.petName}
                  </td>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Breed:</strong> ${data.petBreed || 'Not specified'}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Age:</strong> ${data.petAge ? data.petAge + ' years' : 'Not specified'}
                  </td>
                </tr>
              </table>

              <!-- Appointment Details -->
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Appointment Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                <tr>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Service:</strong> ${data.serviceName}
                  </td>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Price:</strong> &#163;${data.servicePrice}
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Date:</strong> ${data.formattedDate}
                  </td>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Time:</strong> ${data.time}
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Duration:</strong> ${data.serviceDuration} min
                  </td>
                  <td width="50%" style="font-size:14px;color:#374151;padding:3px 0;">
                    <strong style="color:#111827;">Groomer:</strong> ${data.groomerName}
                  </td>
                </tr>
                ${data.notes ? `
                <tr>
                  <td colspan="2" style="font-size:14px;color:#374151;padding:8px 0 3px;">
                    <strong style="color:#111827;">Notes:</strong> ${data.notes}
                  </td>
                </tr>` : ''}
              </table>

              <!-- Appointment ID -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:10px;padding:12px 18px;margin-bottom:28px;">
                <tr>
                  <td style="font-size:12px;color:#9a3412;">
                    <strong>Appointment ID:</strong> ${data.appointmentId}
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://zentivora-eta.vercel.app/admin"
                       style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#f97316,#f59e0b);color:#ffffff;font-size:15px;font-weight:700;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                      Open Admin Panel &#8594;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:24px 40px;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:800;color:#111827;">Zentivora</p>
              <p style="margin:0 0 3px;font-size:12px;color:#6b7280;">128 City Road, London, United Kingdom, EC1V 2NX</p>
              <p style="margin:0 0 3px;font-size:12px;color:#6b7280;">Private Limited Company &bull; Incorporated 24 February 2026</p>
              <p style="margin:0 0 3px;font-size:12px;color:#6b7280;">SIC: 58290 &bull; 62012 &bull; 62020 &bull; 62090</p>
              <p style="margin:14px 0 0;font-size:11px;color:#9ca3af;">
                This notification was sent because a new booking was made on the Zentivora platform.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
