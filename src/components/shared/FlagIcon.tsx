import React from 'react';
import { LanguageCode } from '../../types';

interface FlagIconProps {
  code: LanguageCode;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = "w-5 h-3.5" }) => {
  switch (code) {
    case 'zh-CN':
      // 中国国旗 🇨🇳
      return (
        <svg
          viewBox="0 0 30 20"
          className={`inline-block rounded-[2px] border border-black/30 dark:border-white/40 shadow-sm shrink-0 object-cover ${className}`}
        >
          <rect width="30" height="20" fill="#DE2910" />
          {/* 大星 */}
          <polygon
            fill="#FFDE00"
            points="5,2 6.18,5.62 10,5.62 6.91,7.86 8.09,11.48 5,9.24 1.91,11.48 3.09,7.86 0,5.62 3.82,5.62"
            transform="translate(0, 1) scale(0.6)"
          />
          {/* 小星 1 */}
          <polygon fill="#FFDE00" points="10,2 10.5,3.5 12,3.5 10.8,4.4 11.2,5.8 10,4.9 8.8,5.8 9.2,4.4 8,3.5 9.5,3.5" transform="scale(0.5) translate(10, 1)" />
          {/* 小星 2 */}
          <polygon fill="#FFDE00" points="10,2 10.5,3.5 12,3.5 10.8,4.4 11.2,5.8 10,4.9 8.8,5.8 9.2,4.4 8,3.5 9.5,3.5" transform="scale(0.5) translate(12, 5)" />
          {/* 小星 3 */}
          <polygon fill="#FFDE00" points="10,2 10.5,3.5 12,3.5 10.8,4.4 11.2,5.8 10,4.9 8.8,5.8 9.2,4.4 8,3.5 9.5,3.5" transform="scale(0.5) translate(12, 10)" />
          {/* 小星 4 */}
          <polygon fill="#FFDE00" points="10,2 10.5,3.5 12,3.5 10.8,4.4 11.2,5.8 10,4.9 8.8,5.8 9.2,4.4 8,3.5 9.5,3.5" transform="scale(0.5) translate(10, 14)" />
        </svg>
      );

    case 'zh-TW':
      // 香港特区区旗 🇭🇰
      return (
        <svg
          viewBox="0 0 30 20"
          className={`inline-block rounded-[2px] border border-black/30 dark:border-white/40 shadow-sm shrink-0 object-cover ${className}`}
        >
          <rect width="30" height="20" fill="#E00025" />
          {/* 紫荆花白图案 */}
          <circle cx="15" cy="10" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
          <path
            d="M15 5.5 C16.5 7 16 9 15 10 C14 9 13.5 7 15 5.5 Z"
            fill="#FFFFFF"
          />
          <path
            d="M15 5.5 C16.5 7 16 9 15 10 C14 9 13.5 7 15 5.5 Z"
            fill="#FFFFFF"
            transform="rotate(72 15 10)"
          />
          <path
            d="M15 5.5 C16.5 7 16 9 15 10 C14 9 13.5 7 15 5.5 Z"
            fill="#FFFFFF"
            transform="rotate(144 15 10)"
          />
          <path
            d="M15 5.5 C16.5 7 16 9 15 10 C14 9 13.5 7 15 5.5 Z"
            fill="#FFFFFF"
            transform="rotate(216 15 10)"
          />
          <path
            d="M15 5.5 C16.5 7 16 9 15 10 C14 9 13.5 7 15 5.5 Z"
            fill="#FFFFFF"
            transform="rotate(288 15 10)"
          />
        </svg>
      );

    case 'en':
      // 美国国旗 🇺🇸
      return (
        <svg
          viewBox="0 0 30 20"
          className={`inline-block rounded-[2px] border border-black/30 dark:border-white/40 shadow-sm shrink-0 object-cover ${className}`}
        >
          <rect width="30" height="20" fill="#B22234" />
          <path d="M0 2.85h30M0 5.7h30M0 8.55h30M0 11.4h30M0 14.25h30M0 17.1h30" stroke="#FFFFFF" strokeWidth="1.43" />
          <rect width="12" height="10.7" fill="#3C3B6E" />
          <circle cx="2.5" cy="2.5" r="0.6" fill="#FFFFFF" />
          <circle cx="6" cy="2.5" r="0.6" fill="#FFFFFF" />
          <circle cx="9.5" cy="2.5" r="0.6" fill="#FFFFFF" />
          <circle cx="4.25" cy="5.3" r="0.6" fill="#FFFFFF" />
          <circle cx="7.75" cy="5.3" r="0.6" fill="#FFFFFF" />
          <circle cx="2.5" cy="8.1" r="0.6" fill="#FFFFFF" />
          <circle cx="6" cy="8.1" r="0.6" fill="#FFFFFF" />
          <circle cx="9.5" cy="8.1" r="0.6" fill="#FFFFFF" />
        </svg>
      );

    case 'ja':
      // 日本国旗 🇯🇵
      return (
        <svg
          viewBox="0 0 30 20"
          className={`inline-block rounded-[2px] border border-black/30 dark:border-white/40 shadow-sm shrink-0 object-cover ${className}`}
        >
          <rect width="30" height="20" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="6" fill="#BC002D" />
        </svg>
      );

    case 'ko':
      // 韩国国旗 🇰🇷
      return (
        <svg
          viewBox="0 0 30 20"
          className={`inline-block rounded-[2px] border border-black/30 dark:border-white/40 shadow-sm shrink-0 object-cover ${className}`}
        >
          <rect width="30" height="20" fill="#FFFFFF" />
          {/* 太极图 */}
          <path d="M15 5 A5 5 0 0 1 15 15 A2.5 2.5 0 0 1 15 10 A2.5 2.5 0 0 0 15 5" fill="#CD2E3A" />
          <path d="M15 15 A5 5 0 0 1 15 5 A2.5 2.5 0 0 1 15 10 A2.5 2.5 0 0 0 15 15" fill="#0047A0" />
          {/* 乾卦（左上） */}
          <g stroke="#000" strokeWidth="0.8">
            <line x1="5" y1="4" x2="8" y2="2" />
            <line x1="5.6" y1="4.9" x2="8.6" y2="2.9" />
            <line x1="6.2" y1="5.8" x2="9.2" y2="3.8" />
          </g>
          {/* 坤卦（右下） */}
          <g stroke="#000" strokeWidth="0.8">
            <line x1="20.8" y1="16.2" x2="23.8" y2="14.2" />
            <line x1="21.4" y1="17.1" x2="24.4" y2="15.1" />
            <line x1="22" y1="18" x2="25" y2="16" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};
