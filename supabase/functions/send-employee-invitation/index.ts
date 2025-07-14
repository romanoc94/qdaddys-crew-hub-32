import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  storeName: string;
  inviteToken: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, storeName, inviteToken, role }: InvitationRequest = await req.json();

    const inviteUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${inviteToken}&type=invite&redirect_to=${encodeURIComponent(Deno.env.get('SITE_URL') || 'http://localhost:3000')}`;

    const emailResponse = await resend.emails.send({
      from: "BBQ Management <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to ${storeName} - Set Up Your Account`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #333; margin-bottom: 10px;">Welcome to the Team!</h1>
            <p style="color: #666; font-size: 16px;">You've been invited to join ${storeName}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName},</h2>
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              You've been added to the ${storeName} management system as a <strong>${role.replace('_', ' ')}</strong>. 
              This system will help you manage your shifts, complete checklists, and stay connected with your team.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" 
                 style="background-color: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Set Up Your Account
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
              This invitation will expire in 7 days.
            </p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
            <h3 style="color: #856404; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #856404; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Click the button above to create your password</li>
              <li>Complete your profile information</li>
              <li>Download the mobile app (optional)</li>
              <li>Start managing your shifts and tasks</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>If you have any questions, contact your manager or support.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    console.log("Employee invitation sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending employee invitation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);