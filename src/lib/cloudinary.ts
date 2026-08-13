/// <reference types="vite/client" />
import { t } from './i18nHelper';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '';
const apiSecret = (import.meta as any).env?.CLOUDINARY_API_SECRET || (import.meta as any).env?.VITE_CLOUDINARY_API_SECRET || ''; 

export const isCloudinaryConfigured = Boolean(cloudName && (uploadPreset || apiKey) && !cloudName.includes('your-cloud-name'));
export const isSignedConfigured = Boolean(cloudName && apiKey);

/**
 * SHA-1 哈希值计算工具（使用 Web Crypto API）
 */
async function computeSha1(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 客户端计算签名
 */
export async function signParameters(params: Record<string, string | number>, secret: string): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + secret;
  return await computeSha1(signatureString);
}

/**
 * 获取签名（优先使用后端安全接口，避免前端泄露 Secret，如无后端则回退到本地计算）
 */
async function getSignature(params: Record<string, string | number>): Promise<string> {
  if (apiSecret) {
    return await signParameters(params, apiSecret);
  }

  try {
    const res = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ params })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.signature) return data.signature;
    }
  } catch {
    // fallback
  }

  throw new Error(t('cloudinarySignedNotConfigured'));
}

/**
 * Unsigned 无签名模式上传
 */
export async function uploadToCloudinaryUnsigned(file: File): Promise<string> {
  if (!cloudName || !uploadPreset || cloudName.includes('your-cloud-name')) {
    throw new Error(t('cloudinaryUnsignedNotConfigured'));
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `${t('cloudinaryUploadFailed')}${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Signed 签名安全模式上传
 */
export async function uploadToCloudinarySigned(file: File): Promise<string> {
  if (!cloudName || !apiKey) {
    throw new Error(t('cloudinarySignedNotConfigured'));
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const params: Record<string, string | number> = {
    timestamp: timestamp,
  };

  if (uploadPreset) {
    params['upload_preset'] = uploadPreset;
  }

  const signature = await getSignature(params);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  if (uploadPreset) {
    formData.append('upload_preset', uploadPreset);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `${t('cloudinarySignedUploadFailed')}${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * 从 Cloudinary URL 中解析出 public_id
 * 例如: https://res.cloudinary.com/demo/image/upload/v1570590333/sample.jpg -> sample
 */
export function extractPublicId(url: string): string | null {
  if (!url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1];
    // 去掉开头的版本号 vXXXXXX/ (如果存在)
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
    // 去掉文件后缀 .jpg, .png 等
    const dotIndex = withoutVersion.lastIndexOf('.');
    if (dotIndex === -1) return withoutVersion;
    return withoutVersion.substring(0, dotIndex);
  } catch (e) {
    console.error(t('cloudinaryExtractIdFailed'), e);
    return null;
  }
}

/**
 * 从 Cloudinary 删除一个资源（通过后端安全接口或本地签名模式）
 * @param url 图片的完整 URL
 */
export async function deleteFromCloudinary(url: string): Promise<boolean> {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn(t('cloudinaryNotCloudinaryImage'), url);
    return false;
  }

  try {
    const res = await fetch('/api/cloudinary/destroy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: publicId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return true;
    }
  } catch {
    // fallback to client-side if server endpoint not reachable
  }

  if (!isSignedConfigured || !cloudName || !apiKey || !apiSecret) {
    console.warn(t('cloudinarySignNotConfiguredDelete'));
    return false;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const params: Record<string, string | number> = {
    public_id: publicId,
    timestamp: timestamp,
  };

  const signature = await signParameters(params, apiSecret);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(t('cloudinaryDestroyFailed'), errorData.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    return data.result === 'ok';
  } catch (err) {
    console.error(t('cloudinaryNetworkError'), err);
    return false;
  }
}

// 统一导出默认上传函数，优先使用 Signed 签名模式上传
export const uploadToCloudinary = isSignedConfigured ? uploadToCloudinarySigned : uploadToCloudinaryUnsigned;
