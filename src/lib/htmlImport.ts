import { NewsletterSection } from "@/components/NewsletterEditor";
import parse from 'html-dom-parser';

const findNodesByAttribute = (nodes: any[], attribute: string): any[] => {
  let result: any[] = [];
  for (const node of nodes) {
    if (node.type === 'tag' && node.attribs?.[attribute] !== undefined) {
      result.push(node);
    }
    if (node.children) {
      result = result.concat(findNodesByAttribute(node.children, attribute));
    }
  }
  return result;
};

const getText = (node: any): string => {
  if (!node) return '';
  if (node.type === 'text') {
    return node.data;
  }
  if (node.children) {
    return node.children.map(getText).join('');
  }
  return '';
};

const getAttribute = (node: any, name: string): string | undefined => {
  return node.attribs?.[name];
};

export const parseImportedHTML = (html: string): NewsletterSection[] => {
  const dom = parse(html);
  if (!dom) {
    throw new Error("Failed to parse HTML string.");
  }

  const sections: NewsletterSection[] = [];
  const sectionNodes = findNodesByAttribute(Array.isArray(dom) ? dom : [dom], 'data-section-type');

  console.log("Found section nodes:", sectionNodes.length);

  for (const sectionNode of sectionNodes) {
    const type = getAttribute(sectionNode, 'data-section-type') as NewsletterSection['type'];
    const id = getAttribute(sectionNode, 'data-section-id');
    const rowLayout = getAttribute(sectionNode, 'data-row-layout') as "full" | "half" | undefined;

    if (type && id) {
      const content: any = {};
      const isHero = getAttribute(sectionNode, 'data-is-hero') === 'true';
      if (isHero) {
        content.isHero = true;
      }

      const propNodes = findNodesByAttribute([sectionNode], 'data-property');
      
      for (const propNode of propNodes) {
        const propName = getAttribute(propNode, 'data-property');
        if (propName) {
          if (propName === 'image' || propName === 'puzzleImage' || propName === 'answerImage') {
            content[propName] = getAttribute(propNode, 'src');
            const imageSize = getAttribute(propNode, 'data-image-size');
            if (imageSize) {
              content.imageSize = parseInt(imageSize, 10);
            }
            const imagePosition = getAttribute(propNode, 'data-image-position');
            if (imagePosition) {
              content.imagePosition = imagePosition;
            }
          } else if (propName === 'link') {
            content.link = getAttribute(propNode, 'href');
            content.linkText = getAttribute(propNode, 'data-link-text');
          } else if (propName === 'quote') {
            content[propName] = getText(propNode).replace(/"/g, '');
          } else if (propName === 'date') {
            const dateValue = getAttribute(propNode, 'data-date-value');
            content[propName] = dateValue || getText(propNode);
          }
          else {
            content[propName] = getText(propNode);
          }
        }
      }

      if (type === 'extended-reading') {
        const linkItems = findNodesByAttribute([sectionNode], 'data-property');
        const links = linkItems.filter(item => getAttribute(item, 'data-property') === 'link-item');
        content.links = links.map(item => {
          const titleNode = findNodesByAttribute([item], 'data-property').find(n => getAttribute(n, 'data-property') === 'title');
          const urlNode = findNodesByAttribute([item], 'data-property').find(n => getAttribute(n, 'data-property') === 'url');
          return {
            title: titleNode ? getText(titleNode) : '',
            url: urlNode ? getAttribute(urlNode, 'href') : ''
          };
        });
      }

      if (type === 'footer') {
        const linksContainer = findNodesByAttribute([sectionNode], 'data-property').find(n => getAttribute(n, 'data-property') === 'links');
        if (linksContainer) {
          const linkElements = findNodesByAttribute(linksContainer.children, 'data-property').filter(n => getAttribute(n, 'data-property') === 'link');
          content.links = linkElements.map(getText);
          content.url = linkElements.map(link => getAttribute(link, 'href'));
        }
      }

      const newSection: NewsletterSection = { id, type, content, rowLayout };
      sections.push(newSection);
      console.log("Parsed section:", newSection);
    }
  }

  console.log("Total parsed sections:", sections.length);
  return sections;
};
