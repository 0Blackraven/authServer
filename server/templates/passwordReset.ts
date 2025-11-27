export function passwordResetTemplate(resetCode: string, hash:string): string {

    const subject = "Password Reset Request";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body, table, td, a { 
            -webkit-text-size-adjust: 100%; 
            -ms-text-size-adjust: 100%; 
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #3B82F6; padding: 20px 0; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
        .content { padding: 30px; color: #333333; }
        .code-box { background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 6px; margin: 20px 0; }
        .code-box p { font-size: 32px; font-weight: bold; color: #10B981; margin: 0; font-family: monospace; }
        .footer { padding: 20px; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; text-align: center; }
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; border-radius: 0; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <center style="width: 100%; background-color: #f4f4f4;">
        <div class="container">
            
            <!-- Header -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="header">
                <tr>
                    <td align="center">
                        <h1>Password Reset</h1>
                    </td>
                </tr>
            </table>

            <!-- Content Body -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td class="content">
                        <p>We received a request to reset the password for your account. Please use the code below in the link to proceed with the reset process:</p>
                        
                        <div class="code-box">
                            <p>${resetCode}</p>
                        </div>

                        <a href="http://localhost:5173/resetPassword?code=${hash}" style="display: inline-block; padding: 12px 20px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #3B82F6; text-decoration: none; border-radius: 6px;">Reset Password</a>

                        <p>This link is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
                        
                        <p style="margin-top: 40px;">Sincerely,<br>The Moye Moye Team</p>
                    </td>
                </tr>
            </table>

            <!-- Footer -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td class="footer">
                        &copy; All rights reserved. | This is an automated message.
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
    `;
}