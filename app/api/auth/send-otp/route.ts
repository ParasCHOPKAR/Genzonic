import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";

// Initialize the authenticated Resend instance
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    // 1. Generate a secure 6-digit numeric token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Minute Window

    // 2. Upsert the verification lifecycle into MongoDB
    await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { 
        $set: { 
          otp: otp, 
          otpExpiry: otpExpiry 
        } 
      },
      { upsert: true, new: true, strict: false }
    );

    // 3. Dispatch the branded transactional template via verified pipeline
    const { data, error } = await resend.emails.send({
      from: "GenZonic <auth@genzonic.store>",
      to: [email.toLowerCase().trim()],
      subject: "Verify Your GenZonic Access Token",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>GenZonic Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050b0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050b0c; min-height: 100vh; padding: 40px 20px;">
            <tr>
              <td align="center" valign="top">
                <table width="100%" max-width="500px" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #0a1214; border: 1px solid #14282c; border-radius: 12px; overflow: hidden;">
                  
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; background: linear-gradient(135deg, #ff7a00 0%, #00b4d8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        GENZONIC
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 20px 40px; text-align: center;">
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #a3b8cc;">
                        Use the secure entry code below to authorize your session profile. This token remains active for the next 10 minutes.
                      </p>
                      
                      <div style="background-color: #0e1e21; border-radius: 8px; padding: 18px; margin: 30px 0; border: 1px dashed #00b4d8; letter-spacing: 6px; font-size: 32px; font-weight: 800; color: #ff7a00; text-align: center;">
                        ${otp}
                      </div>

                      <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 18px; color: #52667a;">
                        If you did not initiate this system handshake, please safely disregard this transmission.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 30px 40px 40px 40px; border-top: 1px solid #14282c;">
                      <p style="margin: 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #41566b;">
                        GENZONIC LABS &copy; 2026 // BORN IN INDIA
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend Core Dispatch Error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to broadcast secure packet." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Secure token successfully dispatched to inbox." },
      { status: 200 }
    );

  } catch (globalError: any) {
    console.error("Internal Auth Route Exception:", globalError);
    return NextResponse.json(
      { success: false, message: "Critical server execution fault." },
      { status: 500 }
    );
  }
}