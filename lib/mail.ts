'user server';

import { Resend } from 'resend';
import { render } from '@react-email/render';
import ChangeAssigned from '@/email/change-assigned';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendMailProps {
  to: string;
  name: string;
  subject: string;
  body: string;
  message: string;
  assigned: string;
  emailAssigned: string;
  imageAssigned: string;
}

export async function sendMail({
  to,
  name,
  subject,
  body,
  message,
  assigned,
  emailAssigned,
  imageAssigned,
}: SendMailProps) {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;



  try {
    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'mtoro6@gmail.com',
        subject: 'Ticket Assigned',
        html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
      });
    
  } catch (error) {
    // Manejo del error al enviar el correo
    console.error("Error sending mail", error);
  }
}