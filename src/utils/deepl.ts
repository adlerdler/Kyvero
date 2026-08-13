export async function translateTextWithDeepL(sourceText: string): Promise<Record<string, string>> {
  const targetLanguages = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];
  const result: Record<string, string> = {};

  // If source text is empty, return empty records
  if (!sourceText || sourceText.trim() === '') {
    targetLanguages.forEach(lang => {
      result[lang] = '';
    });
    return result;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourceText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.translations) {
      return data.translations;
    }
  } catch (error) {
    console.warn('DeepL translation via backend failed:', error);
  }

  return result;
}
