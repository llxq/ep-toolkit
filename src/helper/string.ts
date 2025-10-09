import emojiRegex from "emoji-regex";

/**
 * 通过 emoji-regex 移除 emoji 表情
 * @see https://www.npmjs.com/package/emoji-regex
 * @param str 原始字符串
 * @returns 移除 emoji 后的字符串
 */
export const trimEmoji = (str: string): string => str.replace(emojiRegex(), "");
