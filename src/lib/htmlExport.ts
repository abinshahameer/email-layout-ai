import { NewsletterSection } from "@/components/NewsletterEditor";

const renderSection = (section: NewsletterSection): string => {
  switch (section.type) {
    case "header":
      return `
        <table data-section-type="header" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #323741; color: #ffffff;">
          <tr>
            <td style="padding: 16px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size: 12px; font-weight: 600; text-align: left;">
                    <img
                      src="https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/logo-rgb-white.png"
                      alt="TCS Logo"
                      style="height: 25px; width: auto; display: block;"
                      data-property="logo"
                    />
                  </td>
                  <td style="font-size: 16px; text-align: right;">
                    <span style="margin-right: 24px;" data-property="episode">${section.content.episode || ""}</span>
                    <span style="margin-right: 24px;" data-property="lab">${section.content.lab || ""}</span>
                    <a href="https://forms.office.com/r/8exqUT0nmD" target="_blank" style="background-color: #0566e9; color: #ffffff; text-decoration: none; padding: 8px 12px; border-radius: 9999px; border: 1px solid #0566e9;">Subscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

    case "article":
      if (section.content.isHero) {
        return `
          <table data-section-type="article" data-section-id="${section.id}" data-is-hero="true" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #1e6ef5; background: linear-gradient(to right, #1e6ef5, #1557b0);">
            <tr>
              <td style="padding: 45px; position: relative; color: #ffffff;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size: 48px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">
                      <span data-property="title">${section.content.title || ""}</span>
                      <p style="font-size: 16px; font-weight: 400; letter-spacing: normal; margin-top: 16px;margin-left:2px; margin" data-property="date">${section.content.date || ""}</p>
                    </td>
                    ${section.content.quote ? `
                      <td style="max-width: 350px; font-size: 16px; font-style: italic; color: #ffffff; vertical-align: top; padding-top:10px">
                        <pre style="margin: 0; font-style: italic; font-family: 'Segoe UI', Arial, sans-serif; white-space: pre-wrap;" data-property="quote">"${section.content.quote}"</pre>
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
        
        return `
          <table data-section-type="article" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #e8e8e8;">
            <tr>
              <td style="padding: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #1e6ef5;" data-property="title">
                  ${section.content.title || ""}
                </h3>
                
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
                        <p style="margin: 0; line-height: 1.6; font-size: 16px; color: #333333;" data-property="description">
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
                  <p style="margin: 0 0 12px 0; line-height: 1.6; font-size: 16px; color: #333333;" data-property="description">
                    ${section.content.description || ""}
                  </p>
                `}
                
                ${section.content.link ? `
                  <p style="margin: 12px 0 0 0;">
                    <a href="${section.content.link}" target="_blank" rel="noopener noreferrer" style="color: #1e6ef5; text-decoration: none; font-size: 16px;" data-property="link" data-link-text="${section.content.linkText || ''}">
                      ${section.content.linkText ? `Read more: ${section.content.linkText}` : section.content.link}
                    </a>
                  </p>
                ` : ""}
              </td>
            </tr>
          </table>
        `;
      }

    case "comic":
      if (section.content.image) {
        const imageSize = section.content.imageSize || 100;
        return `
          <table data-section-type="comic" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #e8e8e8; background-color: #f8f9fa;">
            <tr>
              <td style="padding: 32px; text-align: center;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1e6ef5;">Comic Section</h3>
                <img 
                  src="${section.content.image}" 
                  alt="${section.content.caption || 'Comic'}" 
                  width="${imageSize}%"
                  style="display: block; max-width: 100%; height: auto; margin: 0 auto; border-radius: 4px;"
                  data-property="image"
                  data-image-size="${imageSize}"
                />
                ${section.content.caption ? `
                  <p style="margin: 12px 0 0 0; font-size: 16px; font-style: italic; color: #666666;" data-property="caption">
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
        <table data-section-type="puzzle" data-section-id="${section.id}" data-row-layout="${section.rowLayout || 'full'}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #e8e8e8; background-color: #E1EFFA;">
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1e6ef5;" data-property="title">
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
                      <pre style="margin: 0; font-size: 16px; color: #333333; line-height: 1.6; white-space: pre-wrap;" data-property="puzzleText">${section.content.puzzleText}</pre>
                    ` : ""}
                  </td>
                  <td width="50%" style="padding-left: 12px; vertical-align: top;">
                    ${puzzleType === "image" && section.content.instructions ? `
                      <pre style="margin: 0 0 16px 0; font-size: 16px; color: #333333; line-height: 1.6; white-space: pre-wrap;" data-property="instructions">
                        ${section.content.instructions}
                      </pre>
                    ` : ""}
                    ${section.content.answerImage || section.content.answerText ? `
                      <div style="border-top: 1px solid #d4c899; padding-top: 16px;" data-property="answer">
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #666666;">Last Week's Answer</p>
                        ${section.content.answerImage ? `
                          <img 
                            src="${section.content.answerImage}" 
                            alt="Answer" 
                            style="display: block; max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;"
                            data-property="answerImage"
                          />
                        ` : ""}
                        ${section.content.answerText ? `<pre style="margin: 8px 0 0 0; padding: 12px; background-color: #fefce8; border-radius: 4px; font-size: 16px; color: #333333;white-space: pre-wrap;" data-property="answerText">${section.content.answerText}</pre>`: ""}
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
              <a href="${link.url}" style="color: #1e6ef5; text-decoration: none; font-size: 16px; display: flex; align-items: center;" data-property="url">
                <span style="margin-right: 8px;">→</span> <span data-property="title">${link.title}</span>
              </a>
            </td>
          </tr>
        `)
        .join("");
      
      if (links) {
        return `
          <table data-section-type="extended-reading" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #e8e8e8; background-color: #fafafa;">
            <tr>
              <td style="padding: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #1e6ef5;">Extended Reading</h3>
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
        .map((link: string,index: any) => `<a href=${section.content.url[index]} target="_blank" rel="noopener noreferrer" style="color: #1e6ef5 !important; text-decoration: none; margin: 0 12px; font-size: 16px; cursor: pointer;" data-property="link">${link}</a>`)
        .join("");
      
      return `
        <table data-section-type="footer" data-section-id="${section.id}" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9;">
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="margin-bottom: 16px;" data-property="links">
                ${footerLinks}
              </div>
              <p style="margin: 0; font-size: 14px; color: #64748b;" data-property="copyright">
                ${section.content.copyright || ""}
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
  let i = 0;

  while (i < sections.length) {
    const section = sections[i];

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
              <td width="50%" style="vertical-align: top;">
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
        <table role="presentation" width="700" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 700px;" id="newsletter-container">
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
