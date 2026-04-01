import { headers } from 'next/headers';

/**
 * Advanced Bot Protection Utility (V.2026)
 * Detects common bots, scrapers, and headless browsers.
 */
export async function checkBotScore(): Promise<{ isBot: boolean; reason?: string }> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  
  // 1. Common Bot User Agents
  const botKeywords = [
    'bot', 'spider', 'crawl', 'headless', 'puppeteer', 'selenium', 
    'playwright', 'axios', 'python-requests', 'curl', 'wget'
  ];
  
  if (botKeywords.some(keyword => userAgent.includes(keyword))) {
    return { isBot: true, reason: 'AUTOMATED_AGENT_DETECTED' };
  }

  // 2. Headless Browser Check (Sec-Ch-Ua Header)
  // Most modern browsers send this; many scrapers don't.
  const secChUa = headersList.get('sec-ch-ua');
  if (!secChUa && !userAgent.includes('mobile')) {
    return { isBot: true, reason: 'MISSING_SECURE_METADATA' };
  }

  return { isBot: false };
}
