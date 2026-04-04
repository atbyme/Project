import { headers } from 'next/headers';

/**
 * Bot Protection
 * Checks user agent and request headers for common bot/scraping patterns.
 */
export async function checkBotScore(): Promise<{ isBot: boolean; reason?: string }> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';

  // Known bot and scraper user agents
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper',
    'headless', 'puppeteer', 'selenium',
    'playwright', 'phantom', 'curl', 'wget',
    'python-requests', 'python-urllib',
    'scrapy', 'httpclient', 'java/',
    'go-http-client', 'libwww-perl',
  ];

  for (const pattern of botPatterns) {
    if (userAgent.includes(pattern)) {
      return { isBot: true, reason: `Bot pattern detected: ${pattern}` };
    }
  }

  // Legitimate browsers always have accept-language
  const acceptLanguage = headersList.get('accept-language');
  if (!acceptLanguage) {
    return { isBot: true, reason: 'Missing accept-language header' };
  }

  // Legitimate browsers send accept header
  const accept = headersList.get('accept');
  if (!accept) {
    return { isBot: true, reason: 'Missing accept header' };
  }

  return { isBot: false };
}
