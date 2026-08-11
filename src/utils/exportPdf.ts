import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SiteData } from '../types';
import { TRANSLATIONS, TranslationDictionary, LanguageCode } from '../i18n/languages';

export const exportPortfolioToPDF = async (data: SiteData, language: string) => {
  const langKey = (language as LanguageCode) in TRANSLATIONS ? (language as LanguageCode) : 'zh-CN';
  const t: TranslationDictionary = TRANSLATIONS[langKey] || TRANSLATIONS['zh-CN'];

  // Create a temporary off-screen element for PDF rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '800px'; // A4 width proportion
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';

  const localeStr = langKey === 'zh-CN' ? 'zh-CN'
                  : langKey === 'zh-TW' ? 'zh-TW'
                  : langKey === 'ja' ? 'ja-JP'
                  : langKey === 'ko' ? 'ko-KR'
                  : 'en-US';

  const exportDate = new Date().toLocaleDateString(localeStr, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getLocal = (field: any, lang: string) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field['zh-CN'] || field['en'] || Object.values(field)[0] || '';
  };

  // Render HTML structure
  container.innerHTML = `
    <div style="border: 3px solid #000000; padding: 24px; border-radius: 12px; background-color: #ffffff;">
      <!-- Header / Personal Info -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 900; margin: 0; color: #000000; line-height: 1.2;">
            ${data.profile.name || 'Kaito Lin'}
          </h1>
          <p style="font-size: 14px; font-weight: 700; color: #4b5563; margin: 4px 0 0 0;">
            ${getLocal(data.profile.title, language) || 'Fullstack Engineer'}
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
            ${(data.profile.skills || [])
              .map(
                s => `<span style="background-color: #fef08a; border: 1px solid #000000; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">${s}</span>`
              )
              .join('')}
          </div>
        </div>

        <div style="text-align: right; font-size: 11px; font-weight: 700; color: #6b7280;">
          <div style="background-color: #e0f2fe; border: 1px solid #000000; padding: 4px 8px; border-radius: 6px; display: inline-block; font-weight: 900; color: #000000; margin-bottom: 4px;">
            PORTFOLIO RESUME
          </div>
          <div>${t.pdfExportTitle || 'Export Date'}: ${exportDate}</div>
          <div>${t.statusLabel}: ${data.profile.statusText || 'Available for projects'}</div>
        </div>
      </div>

      <!-- Bio / Summary -->
      ${
        (() => {
          const bioLines = Array.isArray(data.profile.bioLines)
            ? data.profile.bioLines
            : (data.profile.bioLines as Record<LanguageCode, string[]>)[langKey] || (data.profile.bioLines as Record<LanguageCode, string[]>)['zh-CN'] || Object.values(data.profile.bioLines)[0] || [];
          return bioLines && bioLines.length > 0
            ? `<div style="margin-bottom: 20px; background-color: #f9fafb; border: 1.5px solid #000000; padding: 12px 16px; border-radius: 8px;">
                <h3 style="font-size: 12px; font-weight: 900; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">${t.profileSection}</h3>
                <p style="font-size: 11px; line-height: 1.5; font-weight: 600; color: #1f2937; margin: 0;">
                  ${bioLines.join(' ')}
                </p>
              </div>`
            : '';
        })()
      }

      <!-- Tech Stack Section -->
      ${
        data.techSkills && data.techSkills.length > 0
          ? `<div style="margin-bottom: 24px;">
              <h2 style="font-size: 16px; font-weight: 900; border-bottom: 1.5px solid #000000; padding-bottom: 4px; margin: 0 0 12px 0;">
                ${t.techStack}
              </h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${data.techSkills
                  .map(
                    skill => {
                      const taglineStr = getLocal(skill.tagline, langKey);
                      return `
                  <div style="border: 1px solid #000000; border-radius: 6px; padding: 6px 10px; background-color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 11px; font-weight: 800; color: #000000;">${skill.name} <span style="font-size: 9px; color: #6b7280; font-weight: 600;">(${skill.category})</span></div>
                      ${taglineStr ? `<div style="font-size: 9px; color: #4b5563; margin-top: 2px;">${taglineStr}</div>` : ''}
                    </div>
                    <span style="font-size: 10px; font-weight: 900; font-family: monospace; background-color: #dcfce7; border: 1px solid #000000; padding: 1px 5px; border-radius: 4px;">
                      ${skill.level}%
                    </span>
                  </div>
                `;
                    }
                  )
                  .join('')}
              </div>
            </div>`
          : ''
      }

      <!-- Projects Section -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 16px; font-weight: 900; border-bottom: 1.5px solid #000000; padding-bottom: 4px; margin: 0 0 14px 0; display: flex; justify-content: space-between; align-items: center;">
          <span>${t.allProjects} (${data.projects.length})</span>
        </h2>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${data.projects
            .map(
              (project, index) => `
            <div style="border: 1.5px solid #000000; border-radius: 8px; padding: 12px; background-color: ${project.featured ? '#fffbebfd' : '#ffffff'};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="background-color: #000000; color: #ffffff; font-size: 10px; font-weight: 900; padding: 1px 6px; border-radius: 4px; font-family: monospace;">
                    #0${index + 1}
                  </span>
                  <h3 style="font-size: 13px; font-weight: 900; margin: 0; color: #000000;">
                    ${getLocal(project.title, langKey)}
                  </h3>
                  ${
                    project.featured
                      ? `<span style="background-color: #f43f5e; color: #ffffff; border: 1px solid #000000; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 3px;">${t.featuredProjects}</span>`
                      : ''
                  }
                </div>
                <span style="background-color: #e2e8f0; border: 1px solid #000000; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 4px;">
                  ${getLocal(project.category, langKey)}
                </span>
              </div>

              <p style="font-size: 11px; font-weight: 700; color: #374151; margin: 4px 0 6px 0; line-height: 1.4;">
                ${getLocal(project.summary, langKey)}
              </p>

              ${
                project.tags && (Array.isArray(project.tags) ? project.tags.length > 0 : Boolean(project.tags))
                  ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
                      ${(Array.isArray(project.tags) ? project.tags : String(project.tags).split(','))
                        .map(
                          tagItem => `<span style="background-color: #f3f4f6; border: 1px solid #9ca3af; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">${tagItem.trim()}</span>`
                        )
                        .join('')}
                    </div>`
                  : ''
              }

              ${
                project.demoUrl || project.githubUrl
                  ? `<div style="margin-top: 8px; pt: 4px; border-top: 1px dashed #d1d5db; display: flex; gap: 12px; font-size: 9px; font-family: monospace; font-weight: 700; color: #4b5563;">
                      ${project.demoUrl ? `<div>Demo: ${project.demoUrl}</div>` : ''}
                      ${project.githubUrl ? `<div>GitHub: ${project.githubUrl}</div>` : ''}
                    </div>`
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Social / Contact Links Footer -->
      <div style="border-top: 2px solid #000000; padding-top: 12px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; font-weight: 700; color: #4b5563;">
        <div>
          ${t.contactMe}: ${data.socialLinks.map(s => `${s.name || s.type} (${s.url})`).join(' · ')}
        </div>
        <div style="font-family: monospace; font-weight: 900; color: #000000;">
          A1L MECHA SYSTEM GENERATED
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution crisp output
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Handle multi-page if content overflows A4 height
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const fileName = `${data.profile.name || 'Portfolio'}_Projects_Resume.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
};

