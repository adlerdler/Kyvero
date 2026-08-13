export async function translateTextWithDeepL(sourceText: string): Promise<Record<string, string>> {
  const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
  const targetLanguages = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];
  const result: Record<string, string> = {};

  // If source text is empty, return empty records
  if (!sourceText || sourceText.trim() === '') {
    targetLanguages.forEach(lang => {
      result[lang] = '';
    });
    return result;
  }

  // If DeepL API key is not configured or placeholder, do not populate other languages
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-deepl-api-key') {
    return result;
  }

  const mapDeepLLang = (code: string) => {
    if (code === 'zh-TW') return 'ZH-HANT';
    if (code === 'zh-CN') return 'ZH';
    if (code === 'en') return 'EN';
    if (code === 'ja') return 'JA';
    if (code === 'ko') return 'KO';
    return 'EN';
  };

  try {
    await Promise.all(
      targetLanguages.map(async (langCode) => {
        const deeplTarget = mapDeepLLang(langCode);

        const response = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: [sourceText],
            target_lang: deeplTarget,
          }),
        });

        if (!response.ok) {
          throw new Error(`DeepL API error for ${langCode}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.translations && data.translations.length > 0) {
          result[langCode] = data.translations[0].text;
        }
      })
    );
  } catch (error) {
    console.warn('DeepL translation API request failed, other languages not filled:', error);
  }

  return result;
}
