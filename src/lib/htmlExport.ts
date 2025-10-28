import { NewsletterSection } from "@/components/NewsletterEditor";

export const exportToHTML = (sections: NewsletterSection[]): string => {
  // Outlook-compatible inline styles
  const styles = `
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
  `;

  let bodyContent = "";

  sections.forEach((section) => {
    switch (section.type) {
      case "header":
        bodyContent += `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #323741; color: #ffffff;">
            <tr>
              <td style="padding: 16px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                  <td style="font-size: 12px; font-weight: 600; text-align: left;">
  <img
    src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
    alt="TCS Logo"
    style="height: 25px; width: auto; display: block;"
  />
</td>

                    <td style="font-size: 14px; text-align: right;">
                      <span style="margin-right: 24px;">${section.content.date || ""}</span>
                      <span style="margin-right: 24px;">${section.content.episode || ""}</span>
                      <span>${section.content.lab || ""}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
        break;

      case "article":
        if (section.content.isHero) {
          bodyContent += `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #1e6ef5; background: linear-gradient(to right, #1e6ef5, #1557b0);">
              <tr>
                <td style="padding: 48px; position: relative; color: #ffffff;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-size: 48px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">
                        ${section.content.title || ""}
                      </td>
                      ${section.content.quote ? `
                        <td style="max-width: 250px; font-size: 13px; font-style: italic; color: #ffffff; text-align: right; vertical-align: top;">
                          " ${section.content.quote} "
                        </td>
                      ` : ""}
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `;
        } else {
          const imagePosition = section.content.imagePosition || "top";
          const imageSize = section.content.imageSize || 100;
          
          bodyContent += `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #e8e8e8;">
              <tr>
                <td style="padding: 24px;">
                  <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #1e6ef5;">
                    ${section.content.title || ""}
                  </h3>
                  
                  ${section.content.image && imagePosition === "top" ? `
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td>
                          <img 
                            src="${section.content.image}" 
                            alt="${section.content.imageAlt || 'Article image'}" 
                            width="${imageSize}%" 
                            style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                          />
                        </td>
                      </tr>
                    </table>
                  ` : ""}
                  
                  ${section.content.image && (imagePosition === "left" || imagePosition === "right") ? `
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        ${imagePosition === "left" ? `
                          <td width="${imageSize}%" style="padding-right: 16px; vertical-align: top;">
                            <img 
                              src="${section.content.image}" 
                              alt="${section.content.imageAlt || 'Article image'}" 
                              width="100%" 
                              style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                            />
                          </td>
                        ` : ""}
                        <td style="vertical-align: top;">
                          <p style="margin: 0; line-height: 1.6; font-size: 13px; color: #333333;">
                            ${section.content.description || ""}
                          </p>
                        </td>
                        ${imagePosition === "right" ? `
                          <td width="${imageSize}%" style="padding-left: 16px; vertical-align: top;">
                            <img 
                              src="${section.content.image}" 
                              alt="${section.content.imageAlt || 'Article image'}" 
                              width="100%" 
                              style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                            />
                          </td>
                        ` : ""}
                      </tr>
                    </table>
                  ` : `
                    <p style="margin: 0 0 12px 0; line-height: 1.6; font-size: 13px; color: #333333;">
                      ${section.content.description || ""}
                    </p>
                  `}
                  
                  ${section.content.link ? `
                    <p style="margin: 12px 0 0 0;">
                      <a href="${section.content.link}" style="color: #1e6ef5; text-decoration: none; font-size: 13px;">
                        ${section.content.link}
                      </a>
                    </p>
                  ` : ""}
                </td>
              </tr>
            </table>
          `;
        }
        break;

      case "comic":
        if (section.content.image) {
          bodyContent += `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #e8e8e8; background-color: #f8f9fa;">
              <tr>
                <td style="padding: 32px; text-align: center;">
                  <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1e6ef5;">Comic Section</h3>
                  <img 
                    src="${section.content.image}" 
                    alt="${section.content.caption || 'Comic'}" 
                    style="display: block; max-width: 100%; height: auto; margin: 0 auto; border-radius: 4px;"
                  />
                  ${section.content.caption ? `
                    <p style="margin: 12px 0 0 0; font-size: 13px; font-style: italic; color: #666666;">
                      ${section.content.caption}
                    </p>
                  ` : ""}
                </td>
              </tr>
            </table>
          `;
        }
        break;

      case "puzzle":
        bodyContent += `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #e8e8e8; background-color: #fefce8;">
            <tr>
              <td style="padding: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1e6ef5;">
                  ${section.content.title || "Puzzle"}
                </h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50%" style="padding-right: 12px; vertical-align: top;">
                      ${section.content.puzzleImage ? `
                        <img 
                          src="${section.content.puzzleImage}" 
                          alt="Puzzle" 
                          width="100%" 
                          style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                        />
                      ` : ""}
                    </td>
                    <td width="50%" style="padding-left: 12px; vertical-align: top;">
                      <p style="margin: 0 0 16px 0; font-size: 13px; color: #333333; line-height: 1.6;">
                        ${section.content.instructions || ""}
                      </p>
                      ${section.content.qrCode ? `
                        <div style="border-top: 1px solid #e8e8e8; padding-top: 16px;">
                          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #666666;">Scan to Solve</p>
                          <img 
                            src="${section.content.qrCode}" 
                            alt="QR Code" 
                            width="128" 
                            height="128" 
                            style="display: block; border-radius: 4px;"
                          />
                        </div>
                      ` : ""}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
        break;

      case "footer":
        const links = (section.content.links || [])
          .map((link: string) => `<a href="#" style="color: #1e6ef5; text-decoration: none; margin: 0 12px; font-size: 14px;">${link}</a>`)
          .join("");
        
        bodyContent += `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9;">
            <tr>
              <td style="padding: 32px; text-align: center;">
                <div style="margin-bottom: 16px;">
                  ${links}
                </div>
                <p style="margin: 0; font-size: 12px; color: #64748b;">
                  ${section.content.copyright || ""}
                </p>
              </td>
            </tr>
          </table>
        `;
        break;
    }
  });

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Newsletter</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>${styles}</style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" width="700" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 700px;">
          <tr>
            <td>
              ${bodyContent}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
