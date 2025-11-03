'use server';

import { Resend } from 'resend';

export async function sendTestEmail() {
  try {
    const resend = new Resend('re_iwJEH54X_6LD6WFKgMt4mFF1xeiP9ETYR');

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'huguitoezequiel8@gmail.com',
      subject: 'Hello World from MooviTech!',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email.' };
    }

    console.log('Email sent successfully:', data);
    return { success: true, message: 'Email sent successfully!' };

  } catch (error) {
    console.error('Caught error in sendTestEmail:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}