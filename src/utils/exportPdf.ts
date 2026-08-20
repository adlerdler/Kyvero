import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { SiteData, LanguageCode, Experience, Project, TechSkill } from '../types';
import { TRANSLATIONS, TranslationDictionary, DEFAULT_LANGUAGE } from '../i18n/languages';
import { parseDescriptionSegments, sortExperiences } from './textUtils';

export const exportPortfolioToPDF = async (
  data: SiteData, 
  language: string, 
  onProgress?: (percent: number, statusText: string) => void
) => {
  onProgress?.(5, '正在整理个人档案与系统配置...');
  const langKey: LanguageCode = (language in TRANSLATIONS) ? (language as LanguageCode) : DEFAULT_LANGUAGE;
  const t: TranslationDictionary = TRANSLATIONS[langKey] || TRANSLATIONS[DEFAULT_LANGUAGE];

  // Helper for localized text fields
  const getLocalText = (field: Record<LanguageCode, string> | string | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[langKey] || field[DEFAULT_LANGUAGE] || field['en'] || Object.values(field)[0] || '';
  };

  // Helper for localized string arrays
  const getLocalArray = (field: Record<LanguageCode, string[]> | string[] | undefined): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field[langKey] || field[DEFAULT_LANGUAGE] || field['en'] || Object.values(field)[0] || [];
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kyvero.dev';

  // Generate QR Code data URL
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(currentUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.warn('QR code generation for PDF skipped:', err);
  }

  const profile = data.profile;
  const experiences: Experience[] = sortExperiences(data.experiences || []);
  const projects: Project[] = data.projects || [];
  const techSkills: TechSkill[] = data.techSkills || [];
  const bioLines = getLocalArray(profile.bioLines);
  const profileTitle = getLocalText(profile.title);
  const profileSubtitle = getLocalText(profile.subtitle);

  // External links
  const allExternalLinks: { label: string; url: string }[] = [];
  if (profile.githubUrl) allExternalLinks.push({ label: 'GitHub', url: profile.githubUrl });
  if (profile.blogUrl) allExternalLinks.push({ label: 'Blog', url: profile.blogUrl });
  if (data.socialLinks && data.socialLinks.length > 0) {
    data.socialLinks.forEach(s => {
      if (s.url && !allExternalLinks.some(l => l.url === s.url)) {
        allExternalLinks.push({ label: s.name || s.type, url: s.url });
      }
    });
  }

  // Standard A4 dimensions at 96 DPI: 794px width, 1123px height
  const PAGE_WIDTH = 794;
  const PAGE_HEIGHT = 1123;
  const PADDING = 36;

  // Header HTML (Page 1) - Subtitle on separate line
  const headerHtml = `
    <div style="background-color: #0F172A; color: #FFFFFF; border-radius: 12px; padding: 22px 26px; margin-bottom: 16px; width: 100%; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center;">
      <div style="flex: 1; padding-right: 20px;">
        <div style="display: inline-block; background-color: #38BDF8; color: #0F172A; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; text-transform: uppercase;">
          ${t.pdfExportHeaderDossier || 'Professional Dossier'}
        </div>
        <div style="font-size: 26px; font-weight: 900; color: #FFFFFF; margin-bottom: 6px; line-height: 1.2;">
          ${profile.name || 'Developer'}
        </div>
        <div style="font-size: 13px; font-weight: 700; color: #F8FAFC; line-height: 1.4; margin-bottom: 4px;">
          ${profileTitle}
        </div>
        ${profileSubtitle ? `
          <div style="font-size: 11px; font-weight: 600; color: #94A3B8; line-height: 1.4;">
            ${profileSubtitle}
          </div>
        ` : ''}
      </div>
      ${qrCodeDataUrl ? `
        <div style="background-color: #FFFFFF; border-radius: 10px; padding: 8px; text-align: center; flex-shrink: 0; width: 72px;">
          <img src="${qrCodeDataUrl}" style="width: 64px; height: 64px; display: block; margin: 0 auto 4px auto;" />
          <div style="font-size: 8px; font-weight: 800; color: #0F172A;">${t.pdfExportLiveOnline || 'LIVE PORTFOLIO'}</div>
        </div>
      ` : ''}
    </div>
  `;

  const miniHeaderHtml = (pageNum: number) => `
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="background-color: #0F172A; color: #FFFFFF; font-size: 9.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">PAGE 0${pageNum}</span>
        <span style="font-size: 12px; font-weight: 800; color: #0F172A;">${profile.name}</span>
      </div>
      <span style="font-size: 9.5px; font-weight: 700; color: #64748B;">${t.pdfExportHeaderDossier || 'Professional Dossier'}</span>
    </div>
  `;

  // 1. Personal Strengths (個人優勢 / Overview) without outer border
  const bioHtml = bioLines.length > 0 ? `
    <div style="margin-bottom: 16px; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background-color: #0F172A; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">01</span>
          <span style="font-size: 13.5px; font-weight: 800; color: #0F172A;">${langKey === 'zh-TW' ? '個人優勢' : (langKey === 'zh-CN' ? '个人优势' : 'Personal Strengths')}</span>
        </div>
      </div>
      ${bioLines.map(line => `
        <div style="font-size: 11px; font-weight: 500; color: #334155; line-height: 1.5; margin-bottom: 5px; display: flex; gap: 8px;">
          <span style="color: #38BDF8; font-weight: 800;">▪</span>
          <span>${line}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  // 2. Tech Skills (個人技能)
  const techHtml = techSkills.length > 0 ? `
    <div style="margin-bottom: 16px; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background-color: #0F172A; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">02</span>
          <span style="font-size: 13.5px; font-weight: 800; color: #0F172A;">${langKey === 'zh-TW' ? '個人技能' : (langKey === 'zh-CN' ? '个人技能' : 'Personal Skills')}</span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${techSkills.map(s => `
          <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; background-color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
            <div>
              <div style="font-size: 11.5px; font-weight: 800; color: #0F172A;">${s.name}</div>
              <div style="font-size: 9.5px; font-weight: 600; color: #64748B; margin-top: 2px;">${s.category}</div>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #0F172A;">
              ${s.level}%
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const expHeaderHtml = experiences.length > 0 ? `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="background-color: #0F172A; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">03</span>
        <span style="font-size: 13.5px; font-weight: 800; color: #0F172A;">${t.pdfExportExperienceTimeline || 'Professional Experience'}</span>
      </div>
    </div>
  ` : '';

  const renderExp = (exp: Experience) => {
    const descSegments = parseDescriptionSegments(getLocalText(exp.description));
    const descHtml = descSegments.length > 0
      ? descSegments.map(seg => `
          <div style="display: flex; align-items: flex-start; gap: 6px; margin-bottom: 3px;">
            <span style="color: #0284C7; font-weight: 800; font-size: 11px; line-height: 1.4;">•</span>
            <span style="flex: 1; font-size: 11px; font-weight: 450; color: #334155; line-height: 1.55;">${seg.replace(/^[•\-\*\>]\s*/, '')}</span>
          </div>
        `).join('')
      : '';

    return `
    <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; background-color: #FFFFFF; margin-bottom: 10px; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
          ${getLocalText(exp.role)} <span style="color: #94A3B8; font-weight: 400;">·</span> <span style="color: #0284C7;">${getLocalText(exp.company)}</span>
        </div>
        <div style="font-size: 9.5px; font-weight: 700; color: #64748B;">
          ${exp.startDate} – ${exp.endDate.toLowerCase() === 'present' ? (t.pdfExportPresent || 'Present') : exp.endDate}
        </div>
      </div>
      <div style="margin-bottom: 8px;">
        ${descHtml}
      </div>
      ${exp.technologies && exp.technologies.length > 0 ? `
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px;">
          ${exp.technologies.map(tech => `
            <span style="font-size: 9.5px; font-weight: 600; color: #0284C7;">#${tech}</span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  };

  const projHeaderHtml = projects.length > 0 ? `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="background-color: #0F172A; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">04</span>
        <span style="font-size: 13.5px; font-weight: 800; color: #0F172A;">${t.pdfExportProjectsCatalog || 'Key Projects'}</span>
      </div>
    </div>
  ` : '';

  const renderProj = (proj: Project) => {
    const tagList: string[] = Array.isArray(proj.tags) ? proj.tags : [];

    return `
      <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; background-color: #FFFFFF; margin-bottom: 10px; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 12.5px; font-weight: 800; color: #0F172A;">${getLocalText(proj.title)}</span>
          </div>
          <span style="background-color: #F1F5F9; border: 1px solid #E2E8F0; font-size: 9px; font-weight: 700; color: #475569; padding: 2.5px 7px; border-radius: 4px;">${getLocalText(proj.category) || 'Software'}</span>
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #1E293B; margin-bottom: 4px;">${getLocalText(proj.summary)}</div>
        ${tagList.length > 0 ? `
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
            ${tagList.map(tag => `
              <span style="font-size: 9px; font-weight: 600; color: #0284C7;">#${tag}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  };

  const linksHtml = allExternalLinks.length > 0 ? `
    <div style="margin-bottom: 16px; box-sizing: border-box;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
        <span style="background-color: #0F172A; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">05</span>
        <span style="font-size: 13.5px; font-weight: 800; color: #0F172A;">${t.pdfExportExternalLinks || 'External Links'}</span>
      </div>
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; display: flex; flex-wrap: wrap; gap: 8px;">
        ${allExternalLinks.map(l => `
          <div style="background-color: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; padding: 4px 10px; font-size: 9.5px; display: flex; gap: 6px;">
            <span style="font-weight: 800; color: #0F172A; background-color: #F1F5F9; padding: 1px 5px; border-radius: 3px;">${l.label}</span>
            <span style="font-weight: 600; color: #0284C7;">${l.url}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const footerHtml = (page: number, total: number) => `
    <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; font-weight: 600; color: #64748B;">
      <div>${data.systemConfig?.copyrightText || profile.copyrightText || `© 2026 ${profile.name}`}</div>
      <div style="font-weight: 800; color: #0F172A; display: flex; gap: 8px; align-items: center;">
        <span>PAGE ${page} / ${total}</span>
      </div>
    </div>
  `;

  // Assemble all blocks
  interface Block {
    html: string;
    isHeader?: boolean;
  }

  const blocks: Block[] = [];
  if (bioHtml) blocks.push({ html: bioHtml });
  if (techHtml) blocks.push({ html: techHtml });
  if (experiences.length > 0) {
    blocks.push({ html: expHeaderHtml, isHeader: true });
    experiences.forEach(e => blocks.push({ html: renderExp(e) }));
  }
  if (projects.length > 0) {
    blocks.push({ html: projHeaderHtml, isHeader: true });
    projects.forEach(p => blocks.push({ html: renderProj(p) }));
  }
  if (linksHtml) blocks.push({ html: linksHtml });

  onProgress?.(15, '正在测量布局并初始化 A4 纸张排版...');

  // Measurement probe container placed off-screen
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.top = '-9999px';
  probe.style.left = '-9999px';
  probe.style.width = `${PAGE_WIDTH}px`;
  probe.style.padding = `${PADDING}px`;
  probe.style.boxSizing = 'border-box';
  probe.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  probe.style.backgroundColor = '#FFFFFF';
  probe.style.opacity = '0';
  probe.style.pointerEvents = 'none';
  probe.style.zIndex = '-9999';
  document.body.appendChild(probe);

  const measureHeight = (bList: Block[], isFirst: boolean, pNum: number) => {
    probe.innerHTML = `
      <div style="display: flex; flex-direction: column; width: 100%; box-sizing: border-box;">
        <div>
          ${isFirst ? headerHtml : miniHeaderHtml(pNum)}
          <div>${bList.map(b => b.html).join('')}</div>
        </div>
        ${footerHtml(pNum, 99)}
      </div>
    `;
    return probe.scrollHeight;
  };

  // Split into pages
  const pages: Block[][] = [];
  let currentPage: Block[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isFirst = pages.length === 0;
    const pNum = pages.length + 1;

    const candidate = [...currentPage, block];
    let testCandidate = candidate;
    if (block.isHeader && i + 1 < blocks.length) {
      testCandidate = [...candidate, blocks[i + 1]];
    }

    const h = measureHeight(testCandidate, isFirst, pNum);
    if (h > (PAGE_HEIGHT - 10) && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [block];
    } else {
      currentPage.push(block);
    }
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  document.body.removeChild(probe);

  const totalPages = pages.length;
  onProgress?.(30, `完成智能排版，共需渲染 ${totalPages} 页档案图层...`);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  for (let idx = 0; idx < totalPages; idx++) {
    const pageBlocks = pages[idx];
    const isFirst = idx === 0;

    const currentPercent = Math.min(85, 30 + Math.floor(((idx + 0.5) / totalPages) * 55));
    onProgress?.(currentPercent, `正在绘制高精度图层 [第 ${idx + 1} / ${totalPages} 页]...`);

    const pageDiv = document.createElement('div');
    pageDiv.style.position = 'fixed';
    pageDiv.style.top = '-9999px';
    pageDiv.style.left = '-9999px';
    pageDiv.style.width = `${PAGE_WIDTH}px`;
    pageDiv.style.height = `${PAGE_HEIGHT}px`;
    pageDiv.style.backgroundColor = '#FFFFFF';
    pageDiv.style.color = '#0F172A';
    pageDiv.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    pageDiv.style.padding = `${PADDING}px`;
    pageDiv.style.boxSizing = 'border-box';
    pageDiv.style.display = 'flex';
    pageDiv.style.flexDirection = 'column';
    pageDiv.style.justifyContent = 'space-between';
    pageDiv.style.zIndex = '-9999';
    pageDiv.style.opacity = '1';
    pageDiv.style.pointerEvents = 'none';

    pageDiv.innerHTML = `
      <div style="display: flex; flex-direction: column; width: 100%;">
        ${isFirst ? headerHtml : miniHeaderHtml(idx + 1)}
        <div>${pageBlocks.map(b => b.html).join('')}</div>
      </div>
      ${footerHtml(idx + 1, totalPages)}
    `;

    document.body.appendChild(pageDiv);

    try {
      const canvas = await html2canvas(pageDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        windowWidth: PAGE_WIDTH,
        windowHeight: PAGE_HEIGHT,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (idx > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    } finally {
      document.body.removeChild(pageDiv);
    }
  }

  onProgress?.(92, '正在打包组装 PDF 文件并触发浏览器下载...');
  const safeName = (profile.name || 'Portfolio').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
  pdf.save(`${safeName}_Professional_Dossier.pdf`);
  onProgress?.(100, '🎉 PDF 档案成功导出，下载已开始！');
};
