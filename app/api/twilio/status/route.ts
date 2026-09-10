import { NextResponse } from 'next/server';

export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  const isConfigured = !!(accountSid && authToken);

  return NextResponse.json({
    configured: isConfigured,
    phoneNumber: phoneNumber || null,
    hasAccountSid: !!accountSid,
    hasAuthToken: !!authToken,
  });
}
