interface AuthCodeEmailContent {
  subject: string;
  preheader: string;
  badge: string;
  heading: string;
  description: string;
  code: string;
  securityNote: string;
}

export function createAuthCodeEmailHtml({
  subject,
  preheader,
  badge,
  heading,
  description,
  code,
  securityNote,
}: AuthCodeEmailContent): string {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
          <title>${subject}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#0b0f14;font-family:Arial,Helvetica,sans-serif;color:#f4f7fa;">
        <div style="display:none;font-size:1px;color:#0b0f14;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
          ${preheader}
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0f14;">
          <tr>
            <td align="center" style="padding:44px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#141a21;border:1px solid #26313b;border-radius:20px;overflow:hidden;">
                <tr>
                  <td style="padding:30px 36px 26px;border-bottom:1px solid #26313b;">
                    <div style="font-size:20px;line-height:28px;font-weight:700;letter-spacing:0.3px;color:#f4f7fa;">
                      <span style="color:#35d5e5;">&#9679;</span>&nbsp; GloomLink
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 36px 40px;">
                    <div style="display:inline-block;padding:7px 11px;border:1px solid #244b53;border-radius:999px;background-color:#10252a;color:#71e5ed;font-size:11px;line-height:14px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
                      ${badge}
                    </div>
                    <h1 style="margin:20px 0 12px;font-size:28px;line-height:36px;font-weight:700;letter-spacing:-0.5px;color:#f4f7fa;">
                      ${heading}
                    </h1>
                    <p style="margin:0;color:#aab6c2;font-size:15px;line-height:24px;">
                      ${description}
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 24px;">
                      <tr>
                        <td style="padding:17px 24px;background-color:#0d1319;border:1px solid #2d3b47;border-radius:12px;color:#64e1eb;font-family:Arial,Helvetica,sans-serif;font-size:34px;line-height:40px;font-weight:700;letter-spacing:10px;">
                          ${code}
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0;color:#aab6c2;font-size:13px;line-height:21px;">
                      ${securityNote}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:19px 36px;border-top:1px solid #26313b;color:#778592;font-size:12px;line-height:18px;">
                    Sent by GloomLink&nbsp; &middot; &nbsp;Your space to connect
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0;color:#65717d;font-size:11px;line-height:17px;text-align:center;">
                Please do not reply to this automated message.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}
