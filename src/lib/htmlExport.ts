import { NewsletterSection } from "@/components/NewsletterEditor";

export const exportToHTML = (sections: NewsletterSection[]): string => {
  const styles = `
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 700px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #3d4f5f;
      color: #ffffff;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left {
      font-size: 12px;
      font-weight: 600;
    }
    .header-right {
      display: flex;
      gap: 24px;
      font-size: 14px;
    }
    .hero {
      background: linear-gradient(to right, #1e6ef5, #1557b0);
      color: #ffffff;
      padding: 48px;
      position: relative;
    }
    .hero h1 {
      margin: 0;
      font-size: 48px;
      font-weight: 900;
      letter-spacing: 2px;
    }
    .hero-quote {
      position: absolute;
      top: 48px;
      right: 48px;
      max-width: 250px;
      font-size: 13px;
      font-style: italic;
    }
    .article {
      padding: 24px;
      border-bottom: 1px solid #e8e8e8;
    }
    .article h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 700;
      color: #1e6ef5;
    }
    .article p {
      margin: 0 0 12px 0;
      line-height: 1.6;
      font-size: 13px;
      color: #333333;
    }
    .article a {
      color: #1e6ef5;
      text-decoration: none;
      font-size: 13px;
    }
    .article a:hover {
      text-decoration: underline;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 32px;
      text-align: center;
    }
    .footer-links {
      margin-bottom: 16px;
    }
    .footer-links a {
      color: #1e6ef5;
      text-decoration: none;
      margin: 0 12px;
      font-size: 14px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    .footer p {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }
  `;

  let bodyContent = "";

  sections.forEach((section) => {
    switch (section.type) {
      case "header":
        bodyContent += `
          <div class="header">
            <div class="header-left">
              <strong>TCS</strong> TATA CONSULTANCY<br/>SERVICES
            </div>
            <div class="header-right">
              <span>${section.content.date || ""}</span>
              <span>${section.content.episode || ""}</span>
              <span>${section.content.lab || ""}</span>
            </div>
          </div>
        `;
        break;

      case "article":
        if (section.content.isHero) {
          bodyContent += `
            <div class="hero">
              <h1>${section.content.title || ""}</h1>
              ${section.content.quote ? `<div class="hero-quote">" ${section.content.quote} "</div>` : ""}
            </div>
          `;
        } else {
          bodyContent += `
            <div class="article">
              <h3>${section.content.title || ""}</h3>
              <p>${section.content.description || ""}</p>
              ${section.content.link ? `<a href="${section.content.link}">${section.content.link}</a>` : ""}
            </div>
          `;
        }
        break;

      case "footer":
        const links = (section.content.links || [])
          .map((link: string) => `<a href="#">${link}</a>`)
          .join("");
        bodyContent += `
          <div class="footer">
            <div class="footer-links">${links}</div>
            <p>${section.content.copyright || ""}</p>
          </div>
        `;
        break;
    }
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    ${bodyContent}
  </div>
</body>
</html>
  `.trim();
};
