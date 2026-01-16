import { NewsletterSection } from "@/components/NewsletterEditor";
import { format } from "date-fns";

const renderSection = (section: NewsletterSection): string => {
  switch (section.type) {
    case "header":
      const bgImage = section.content.backgroundImage || '';
      const heroStyle = bgImage 
        ? `background-image: url('${bgImage}'); background-size: cover; background-position: center;`
        : `background: linear-gradient(180deg, #0052a3 0%, #0a1628 100%);`;
      
      const ctaButton = section.content.ctaLink ? `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 40px;">
          <tr>
            <td style="background-color: #f5c518; border-radius: 4px; text-align: center;">
              <a href="${section.content.ctaLink}" target="_blank" style="font-size: 16px; font-weight: bold; color: #0a1628; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 4px;">
                ${section.content.ctaText || "Explore More"}
              </a>
            </td>
          </tr>
        </table>
      ` : "";

      return `
        <table data-section-type="header" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <!-- Hero section with background image -->
          <tr>
            <td style="${heroStyle} position: relative; padding: 80px 24px; text-align: center;">
              <!--[if mso]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:400px;">
              <v:fill type="tile" src="${bgImage || ''}" color="#0052a3" />
              <v:textbox inset="0,0,0,0">
              <![endif]-->
              <div style="background: linear-gradient(180deg, rgba(0, 20, 40, 0.8) 0%, rgba(0, 40, 80, 0.9) 100%); position: relative; z-index: 1;">
                <!-- Logo and Date -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 48px;">
                  <tr>
                    <td style="text-align: left;">
                      <img
                        src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
                        alt="TCS Logo"
                        style="height: 28px; width: auto; display: block;"
                        data-property="logo"
                      />
                    </td>
                    <td style="text-align: right; color: #ffffff; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 12px;">
                      ${section.content.date ? format(new Date(section.content.date), "MMM yyyy").toUpperCase() : "JAN 2026"}
                    </td>
                  </tr>
                </table>

                <!-- Main Title -->
                <h1 style="margin: 0; font-size: 40px; font-weight: 900; letter-spacing: 0.2em; color: #ffffff; text-transform: uppercase; padding: 16px 0; border-top: 2px solid rgba(255,255,255,0.2); border-bottom: 2px solid rgba(255,255,255,0.2);" data-property="title">
                  ${section.content.title || "Pace Port Insights"}
                </h1>
                
                <!-- Subtitle -->
                <p style="margin: 24px auto 0 auto; font-size: 18px; line-height: 1.5; color: rgba(255,255,255,0.8); max-width: 600px;" data-property="subtitle">
                  ${section.content.subtitle || "A monthly digest of the latest news, events, and innovations from our ecosystem, designed to inspire and inform."}
                </p>

                <!-- CTA Button -->
                ${ctaButton}
              </div>
              <!--[if mso]>
              </v:textbox>
              </v:rect>
              <![endif]-->
            </td>
          </tr>
        </table>
      `;

    case "article":
      // Skip hero sections (now handled by header)
      if (section.content.isHero) {
        return "";
      }
      
      const imagePosition = section.content.imagePosition || "top";
      const imageSize = section.content.imageSize || 100;
      
      return `
        <table data-section-type="article" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0a1628;" data-property="title">
                ${section.content.title || ""}
              </h3>
              ${section.content.date ? `
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #666666;" data-property="date">
                  ${format(new Date(section.content.date), "PPP")}
                </p>
              ` : ""}
              
              ${section.content.image && imagePosition === "top" ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                  <tr>
                    <td align="center">
                      <img 
                        src="${section.content.image}" 
                        alt="${section.content.imageAlt || 'Article image'}" 
                        width="${imageSize}%" 
                        style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                        data-property="image"
                        data-image-size="${imageSize}"
                        data-image-position="${imagePosition}"
                      />
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso]>
              </v:textbox>
              </v:rect>
              <![endif]-->
            </td>
          </tr>
        </table>
      `;

    case "article":
      // Skip hero sections (now handled by header)
      if (section.content.isHero) {
        return "";
      }
      
      const imagePosition = section.content.imagePosition || "top";
      const imageSize = section.content.imageSize || 100;
      
      return `
        <table data-section-type="article" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0a1628;" data-property="title">
                ${section.content.title || ""}
              </h3>
              ${section.content.date ? `
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #666666;" data-property="date">
                  ${format(new Date(section.content.date), "PPP")}
                </p>
              ` : ""}
              
              ${section.content.image && imagePosition === "top" ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                  <tr>
                    <td align="center">
                      <img 
                        src="${section.content.image}" 
                        alt="${section.content.imageAlt || 'Article image'}" 
                        width="${imageSize}%" 
                        style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                        data-property="image"
                        data-image-size="${imageSize}"
                        data-image-position="${imagePosition}"
                      />
                    </td>
                  </tr>
                </table>
              ` : ""}
              
              ${section.content.image && (imagePosition === "left" || imagePosition === "right") ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    ${imagePosition === "left" ? `
                      <td width="${imageSize}%" style="padding-right: 16px; vertical-align: middle;">
                        <img 
                          src="${section.content.image}" 
                          alt="${section.content.imageAlt || 'Article image'}" 
                          width="100%" 
                          style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                          data-property="image"
                          data-image-size="${imageSize}"
                          data-image-position="${imagePosition}"
                        />
                      </td>
                    ` : ""}
                    <td style="vertical-align: top;">
                      <p style="margin: 0; line-height: 1.6; font-size: 14px; color: #333333;" data-property="description">
                        ${section.content.description || ""}
                      </p>
                    </td>
                    ${imagePosition === "right" ? `
                      <td width="${imageSize}%" style="padding-left: 16px; vertical-align: middle;">
                        <img 
                          src="${section.content.image}" 
                          alt="${section.content.imageAlt || 'Article image'}" 
                          width="100%" 
                          style="display: block; max-width: 100%; height: auto; border-radius: 4px;"
                          data-property="image"
                          data-image-size="${imageSize}"
                          data-image-position="${imagePosition}"
                        />
                      </td>
                    ` : ""}
                  </tr>
                </table>
              ` : `
                <p style="margin: 0 0 12px 0; line-height: 1.6; font-size: 14px; color: #333333;" data-property="description">
                  ${section.content.description || ""}
                </p>
              `}
              
              ${section.content.link ? `
                <p style="margin: 12px 0 0 0;">
                  <a href="${section.content.link}" target="_blank" rel="noopener noreferrer" style="color: #0052a3; text-decoration: none; font-size: 14px;" data-property="link" data-link-text="${section.content.linkText || ''}">
                    ${section.content.linkText ? `Read more: ${section.content.linkText}` : section.content.link}
                  </a>
                </p>
              ` : ""}
            </td>
          </tr>
        </table>
      `;

    case "comic":
      if (section.content.image) {
        const imageSize = section.content.imageSize || 100;
        return `
          <table data-section-type="comic" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
            <tr>
              <td style="padding: 20px; text-align: center;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #0a1628;">Comic Section</h3>
                <img 
                  src="${section.content.image}" 
                  alt="${section.content.caption || 'Comic'}" 
                  width="${imageSize}%"
                  style="display: block; max-width: 100%; height: auto; margin: 0 auto; border-radius: 4px;"
                  data-property="image"
                  data-image-size="${imageSize}"
                />
                ${section.content.caption ? `
                  <p style="margin: 12px 0 0 0; font-size: 14px; font-style: italic; color: #666666;" data-property="caption">
                    ${section.content.caption}
                  </p>
                ` : ""}
              </td>
            </tr>
          </table>
        `;
      }
      return "";

    case "puzzle":
      const puzzleType = section.content.puzzleType || "image";
      const puzzleImageSize = section.content.puzzleImageSize || 100;
      return `
        <table data-section-type="puzzle" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e6f0fa;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0a1628;" data-property="title">
                ${section.content.title || "Puzzle"}
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" style="padding-right: 12px; vertical-align: top;" data-property="puzzle" data-puzzle-type="${puzzleType}">
                    ${puzzleType === "image" && section.content.puzzleImage ? `
                      <img 
                        src="${section.content.puzzleImage}" 
                        alt="Puzzle" 
                        width="${puzzleImageSize}%" 
                        style="display: block;margin: 0 auto; max-width: 100%; height: auto; border-radius: 4px;"
                        data-property="puzzleImage"
                        data-image-size="${puzzleImageSize}"
                      />
                    ` : ""}
                    ${puzzleType === "text" && section.content.puzzleText ? `
                      <pre style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6; white-space: pre-wrap;" data-property="puzzleText">${section.content.puzzleText}</pre>
                    ` : ""}
                  </td>
                  <td width="50%" style="padding-left: 12px; vertical-align: top;">
                    ${puzzleType === "image" && section.content.instructions ? `
                      <pre style="margin: 0 0 16px 0; font-size: 14px; color: #333333; line-height: 1.6; white-space: pre-wrap;" data-property="instructions">
                        ${section.content.instructions}
                      </pre>
                    ` : ""}
                    ${section.content.answerImage || section.content.answerText ? `
                      <div style="border-top: 1px solid #d4c899; padding-top: 16px;" data-property="answer">
                        <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600; color: #666666;">Last Week's Answer</p>
                        ${section.content.answerImage ? `
                          <img 
                            src="${section.content.answerImage}" 
                            alt="Answer" 
                            style="display: block; max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;"
                            data-property="answerImage"
                          />
                        ` : ""}
                        ${section.content.answerText ? `<pre style="margin: 8px 0 0 0; padding: 12px; background-color: #fefce8; border-radius: 4px; font-size: 14px; color: #333333;white-space: pre-wrap;" data-property="answerText">${section.content.answerText}</pre>`: ""}
                      </div>
                    ` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

    case "extended-reading":
      const links = (section.content.links || [])
        .map((link: { title: string; url: string }) => `
          <tr data-property="link-item">
            <td style="padding: 8px 0;">
              <a href="${link.url}" style="color: #0052a3; text-decoration: none; font-size: 14px; display: flex; align-items: center;" data-property="url">
                <span style="margin-right: 8px;">→</span> <span data-property="title">${link.title}</span>
              </a>
            </td>
          </tr>
        `)
        .join("");
      
      if (links) {
        return `
          <table data-section-type="extended-reading" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa;">
            <tr>
              <td style="padding: 20px;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0a1628;">Extended Reading</h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${links}
                </table>
              </td>
            </tr>
          </table>
        `;
      }
      return "";

    case "footer":
      const footerLinks = (section.content.links || [])
        .map((link: string, index: any) => `<a href="${section.content.url?.[index] || '#'}" target="_blank" rel="noopener noreferrer" style="color: #ffffff !important; text-decoration: none; margin: 0 12px; font-size: 13px; cursor: pointer;" data-property="link">${link}</a>`)
        .join("");
      
      return `
        <table data-section-type="footer" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <!-- Footer links -->
          <tr>
            <td style="background-color: #0052a3; padding: 16px 24px; text-align: center;" data-property="links">
              ${footerLinks}
            </td>
          </tr>
          <!-- Copyright -->
          <tr>
            <td style="background-color: #003d7a; padding: 12px 24px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.8);" data-property="copyright">
                ${section.content.copyright || "TCS Pace Port, São Paulo. All rights reserved"}
              </p>
            </td>
          </tr>
        </table>
      `;

    default:
      return "";
  }
};

export const exportToHTML = (sections: NewsletterSection[]): string => {
  // Outlook-compatible inline styles
  const styles = `
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Arial, sans-serif;
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
  let i = 0;

  while (i < sections.length) {
    const section = sections[i];

    // Skip hero articles (now handled by header)
    if (section.type === "article" && section.content.isHero) {
      i++;
      continue;
    }

    // Header, footer, and extended reading are always full width
    if (section.type === "header" || section.type === "footer" || section.type === "extended-reading") {
      bodyContent += renderSection(section);
      i++;
      continue;
    }

    // Check if current section is half width and there's a next section also half width
    if (section.rowLayout === "half" && i + 1 < sections.length && sections[i + 1].rowLayout === "half") {
      const nextSection = sections[i + 1];
      // Skip if next is header/footer/extended-reading
      if (nextSection.type !== "header" && nextSection.type !== "footer" && nextSection.type !== "extended-reading") {
        // Render two sections side by side
        bodyContent += `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="50%" style="vertical-align: top; border-right: 1px solid #e5e7eb;">
                ${renderSection(section)}
              </td>
              <td width="50%" style="vertical-align: top;">
                ${renderSection(nextSection)}
              </td>
            </tr>
          </table>
        `;
        i += 2;
        continue;
      }
    }

    // Render single section
    bodyContent += renderSection(section);
    i++;
  }

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Newsletter - TCS Pace Port São Paulo</title>
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
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px;" id="newsletter-container">
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
