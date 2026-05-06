import { NewsletterSection } from "@/components/NewsletterEditor";
import { format } from "date-fns";

const renderSection = (section: NewsletterSection, isAlternate: boolean = false): string => {
  const brandBlue = "#4E84C4";
  const brandBlack = "#000000";
  const brandWhite = "#FFFFFF";

  switch (section.type) {
    case "header": {
      const bgImage = section.content.backgroundImage || '';
      const brandYellow = "#FBB034";
      const heroStyle = bgImage 
        ? `background-image: url('${bgImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
        : `background-color: #000000;`;
      
      const ctaButton = section.content.ctaLink ? `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 30px;">
          <tr>
            <td style="background-color: ${brandYellow}; border-radius: 4px; text-align: center;">
              <a href="${section.content.ctaLink}" target="_blank" style="font-size: 16px; font-weight: bold; color: #000000; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 4px;">
                ${section.content.ctaText || "Explore More"}
              </a>
            </td>
          </tr>
        </table>
      ` : "";
      return `
        <table data-section-type="header" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="${heroStyle} text-align: center; background-color: #000000;" data-property="backgroundImage" data-value="${bgImage}">
              <!--[if mso]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">
                <v:fill type="frame" src="${bgImage}" color="#000000" />
                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                  <div style="background-color: rgba(0, 0, 0, 0.3); padding:20px 24px 40px 24px;">
              <![endif]-->
              <div style="background-color: rgba(0, 0, 0, 0.3); padding:20px 24px 40px 24px;">
                <!-- Logos Row -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                  <tr>
                    <td style="text-align: left; vertical-align: middle;">
                      <img
                        src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
                        alt="TCS Logo"
                        style="height: 24px; width: auto; display: block;"
                        data-property="logo"
                      />
                    </td>
                    <td style="text-align: right; vertical-align: middle;">
                      <img
                        src="https://www.tata.com/etc.clientlibs/tata/clientlibs/assets/resources/img/pages/nav/Tata_Logo2.svg"
                        alt="Tata Logo"
                        style="height: 35px; width: auto; display: block; margin-left: auto;"
                        data-property="tata-logo"
                      />
                    </td>
                  </tr>
                </table>

                <!-- Date -->
                <p style="margin: 0 0 16px 0; color: #FFFFFF; font-family: Calibri, Candara, Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;" data-property="date" data-date-value="${section.content.date || ''}">
                  ${section.content.date ? (isNaN(new Date(section.content.date).getTime()) ? section.content.date : format(new Date(section.content.date), "MMMM yyyy").toUpperCase()) : "JANUARY 2026"}
                </p>

                <!-- Main Title -->
                <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: ${brandWhite}; text-transform: uppercase; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.4); border-bottom: 1px solid rgba(255,255,255,0.4);" data-property="title">
                  ${section.content.title || "Pace Port Insights"}
                </h1>
                
                <!-- Subtitle -->
                <p style="margin: 20px auto 0 auto; font-size: 18px; line-height: 1.4; color: ${brandWhite}; max-width: 500px;" data-property="subtitle">
                  ${section.content.subtitle || "A monthly digest of the latest news, events, and innovations."}
                </p>

                <!-- CTA Button -->
                ${ctaButton}
              </div>
              <!--[if mso]>
                  </div>
                </v:textbox>
              </v:rect>
              <![endif]-->
            </td>
          </tr>
        </table>
      `;
    }
    case "article": {
      // Skip hero sections (now handled by header)
      if (section.content.isHero) {
        return "";
      }
      
      const imagePosition = section.content.imagePosition || "top";
      const imageSize = section.content.imageSize || 100;
      const backgroundColor = isAlternate ? '#F5F7FA' : '#FFFFFF';
      const brandBlue = "#4E84C4";
      
      return `
        <table data-section-type="article" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${backgroundColor};">
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold; color: #000000;" data-property="title">
                ${section.content.title || ""}
              </h3>
              ${section.content.date ? `
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #666666;" data-property="date" data-date-value="${section.content.date}">
                  ${isNaN(new Date(section.content.date).getTime()) ? section.content.date : format(new Date(section.content.date), "PPP")}
                </p>
              ` : ""}
              
              ${section.content.image && imagePosition === "top" ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
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
                      <td width="${imageSize}%" style="padding-right: 20px; vertical-align: middle;">
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
                      <p style="margin: 0 0 12px 0; line-height: 1.5; font-size: 16px; color: #333333;" data-property="description">
                        ${section.content.description || ""}
                      </p>
                      ${section.content.link ? `
                        <p style="margin: 12px 0 0 0;">
                          <a href="${section.content.link}" target="_blank" rel="noopener noreferrer" style="color: ${brandBlue}; text-decoration: none; font-size: 16px; font-weight: bold;" data-property="link" data-link-text="${section.content.linkText || ''}">
                            ${section.content.linkText ? `Read more: ${section.content.linkText}` : "Read more"}
                          </a>
                        </p>
                      ` : ""}
                    </td>
                    ${imagePosition === "right" ? `
                      <td width="${imageSize}%" style="padding-left: 20px; vertical-align: middle;">
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
                <p style="margin: 0 0 12px 0; line-height: 1.5; font-size: 16px; color: #333333;" data-property="description">
                  ${section.content.description || ""}
                </p>
                ${section.content.link ? `
                  <p style="margin: 12px 0 0 0;">
                    <a href="${section.content.link}" target="_blank" rel="noopener noreferrer" style="color: ${brandBlue}; text-decoration: none; font-size: 16px; font-weight: bold;" data-property="link" data-link-text="${section.content.linkText || ''}">
                      ${section.content.linkText ? `Read more: ${section.content.linkText}` : "Read more"}
                    </a>
                  </p>
                ` : ""}
              `}
            </td>
          </tr>
        </table>
      `;
    }
        case "comic": {
      if (section.content.image) {
        const imageSize = section.content.imageSize || 100;
        return `
          <table data-section-type="comic" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F7FA; border-bottom: 1px solid #E1E8F0;">
            <tr>
              <td style="padding: 24px; text-align: center;">
                <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #4E84C4;">Comic Section</h3>
                <img 
                  src="${section.content.image}" 
                  alt="${section.content.caption || 'Comic'}" 
                  width="${imageSize}%"
                  style="display: block; max-width: 100%; height: auto; margin: 0 auto; border-radius: 4px;"
                  data-property="image"
                  data-image-size="${imageSize}"
                />
                ${section.content.caption ? `
                  <p style="margin: 16px 0 0 0; font-size: 16px; font-style: italic; color: #333333;" data-property="caption">
                    ${section.content.caption}
                  </p>
                ` : ""}
              </td>
            </tr>
          </table>
        `;
      }
      return "";
    }



        case "puzzle": {
          const puzzleType = section.content.puzzleType || "image";
          const puzzleImageSize = section.content.puzzleImageSize || 100;
          const brandBlue = "#4E84C4";
          const brandOrange = "#F15A29";
          return `
            <table data-section-type="puzzle" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #E8F1F8; border-bottom: 1px solid #C1D4E5;">
              <tr>
                <td style="padding: 24px;">
                  <h3 style="margin: 0 0 20px 0; font-size: 22px; font-weight: bold; color: ${brandOrange};" data-property="title">
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
                            style="display: block; margin: 0 auto; max-width: 100%; height: auto; border-radius: 4px;"
                            data-property="puzzleImage"
                            data-image-size="${puzzleImageSize}"
                          />
                        ` : ""}
                        ${puzzleType === "text" && section.content.puzzleText ? `
                          <div style="background-color: #ffffff; padding: 16px; border-radius: 4px; border: 1px dashed ${brandBlue};">
                            <pre style="margin: 0; font-size: 16px; color: #333333; line-height: 1.5; white-space: pre-wrap; font-family: Calibri, Candara, Arial, sans-serif;" data-property="puzzleText">${section.content.puzzleText}</pre>
                          </div>
                        ` : ""}
                      </td>
                      <td width="50%" style="padding-left: 12px; vertical-align: top;">
                        ${puzzleType === "image" && section.content.instructions ? `
                          <pre style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.5; white-space: pre-wrap; font-family: Calibri, Candara, Arial, sans-serif;" data-property="instructions">
                            ${section.content.instructions}
                          </pre>
                        ` : ""}
                        ${section.content.answerImage || section.content.answerText ? `
                          <div style="border-top: 1px solid #C1D4E5; padding-top: 20px;" data-property="answer">
                            <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333333;">Last Week's Answer</p>
                            ${section.content.answerImage ? `
                              <img 
                                src="${section.content.answerImage}" 
                                alt="Answer" 
                                style="display: block; max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;"
                                data-property="answerImage"
                              />
                            ` : ""}
                                                    ${section.content.answerText ? `<div style="margin: 8px 0 0 0; padding: 12px; background-color: #FFFFFF; border-radius: 4px; border: 1px solid #C1D4E5;"><pre style="margin: 0; font-size: 16px; color: #333333; white-space: pre-wrap; font-family: Calibri, Candara, Arial, sans-serif;" data-property="answerText">${section.content.answerText}</pre></div>` : ""}
                                                  </div>
                                                ` : ""}
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                            `;
                                          }
                                      case "extended-reading": {
      const brandBlue = "#4E84C4";
      const brandGreen = "#54B948";
      const links = (section.content.links || [])
        .map((link: { title: string; url: string }) => `
          <tr data-property="link-item">
            <td style="padding-bottom: 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #E1E8F0; border-radius: 4px;">
                <tr>
                  <td style="padding: 12px 16px;">
                     <a href="${link.url}" style="text-decoration: none; display: block;" data-property="url">
                      <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #000000;" data-property="title">${link.title}</p>
                      <p style="margin: 0; font-size: 14px; color: #666666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 500px;">${link.url}</p>
                    </a>
                  </td>
                  <td width="40" align="center" style="padding-right: 16px;">
                    <span style="color: ${brandGreen}; font-size: 20px;">&rarr;</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `)
        .join("");
      
      if (links) {
        return `
          <table data-section-type="extended-reading" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0F4F8; border-bottom: 1px solid #E1E8F0;">
            <tr>
              <td style="padding: 24px;">
                <h3 style="margin: 0 0 20px 0; font-size: 22px; font-weight: bold; color: ${brandBlue};">Extended Reading</h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${links}
                </table>
              </td>
            </tr>
          </table>
        `;
      }
      return "";
    }

    case "footer": {
      const brandBlue = "#4E84C4";
      const footerLinks = (section.content.links || [])
        .map((link: string, index: any) => `<a href="${section.content.url?.[index] || 'https://www.tcs.com/'}" target="_blank" rel="noopener noreferrer" style="color: #ffffff !important; text-decoration: none; margin: 0 12px; font-size: 13px;" data-property="link">${link}</a>`)
        .join("");
      
      return `
        <table data-section-type="footer" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <!-- Footer links -->
          <tr>
            <td style="background-color: ${brandBlue}; padding: 16px 24px; text-align: center;" data-property="links">
              ${footerLinks}
            </td>
          </tr>
          <!-- Copyright -->
          <tr>
            <td style="background-color: #000000; padding: 12px 24px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #FFFFFF;" data-property="copyright">
                ${section.content.copyright || "© TCS Pace Port. All rights reserved."}
              </p>
            </td>
          </tr>
        </table>
      `;}

    default:
      return "";
  }
};

export const exportToHTML = (sections: NewsletterSection[]): string => {
  // Outlook-compatible inline styles with Calibri as primary font
  const styles = `
    body {
      margin: 0;
      padding: 0;
      font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
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
    a {
      text-decoration: none;
    }
    /* Outlook Specific Hack */
    #newsletter-container {
      mso-line-height-rule: exactly;
    }
  `;

  let bodyContent = "";
  let i = 0;
  let isAlternate = false;

  while (i < sections.length) {
    const section = sections[i];

    // Skip hero articles (now handled by header)
    if (section.type === "article" && section.content.isHero) {
      i++;
      continue;
    }

    // Header, footer, and extended reading are always full width and don't affect alternation
    if (section.type === "header" || section.type === "footer" || section.type === "extended-reading") {
      bodyContent += renderSection(section);
      i++;
      continue;
    }

    // Check if current section is half width and there's a next section also half width
    if (section.rowLayout === "half" && i + 1 < sections.length && sections[i + 1].rowLayout === "half") {
      const nextSection = sections[i + 1];
      // Skip if next is header/footer/extended-reading
      if (nextSection.type !== "header" && nextSection.type !== "footer" && nextSection.type !== "extended-reading" && !nextSection.content?.isHero) {
        const leftBgColor = isAlternate ? '#F9FAFB' : '#FFFFFF';
        const rightBgColor = !isAlternate ? '#F9FAFB' : '#FFFFFF';
        
        // Render two sections side by side
        bodyContent += `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="50%" style="vertical-align: top; border-right: 1px solid #e5e7eb; background-color: ${leftBgColor};">
                ${renderSection(section, isAlternate)}
              </td>
              <td width="50%" style="vertical-align: top; background-color: ${rightBgColor};">
                ${renderSection(nextSection, !isAlternate)}
              </td>
            </tr>
          </table>
        `;
        i += 2;
        isAlternate = !isAlternate; // Toggle for the next row
        continue;
      }
    }

    // Render single section
    bodyContent += renderSection(section, isAlternate);
    i++;
    isAlternate = !isAlternate; // Toggle for the next section
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
            <td style="font-size: 0;">
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
