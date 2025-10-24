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
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #1e293b;
      color: #ffffff;
      padding: 32px;
    }
    .header h1 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header h2 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: normal;
    }
    .header p {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
    }
    .article {
      padding: 32px;
      border-bottom: 1px solid #e5e7eb;
    }
    .article h3 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
    }
    .article p {
      margin: 0;
      line-height: 1.6;
      color: #475569;
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
      color: #3b82f6;
      text-decoration: none;
      margin: 0 12px;
      font-size: 14px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    .footer p {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }
  `;

  let bodyContent = "";

  sections.forEach((section) => {
    switch (section.type) {
      case "header":
        bodyContent += `
          <div class="header">
            <h1>${section.content.company || ""}</h1>
            <h2>${section.content.title || ""}</h2>
            <p>${section.content.date || ""}</p>
          </div>
        `;
        break;

      case "article":
        bodyContent += `
          <div class="article">
            <h3>${section.content.title || ""}</h3>
            <p>${section.content.description || ""}</p>
          </div>
        `;
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
