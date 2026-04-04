'use server';

import { checkBotScore } from '@/lib/bot-protection';

/**
 * Generate Next Dynamic Question
 * Returns a fallback question from the local bank.
 * AI question generation happens client-side.
 * 
 * Validates input to prevent abuse.
 */
export async function generateNextQuestion(
  previousAnswers: unknown,
  stepCount: unknown
) {
  try {
    // Bot protection
    const botCheck = await checkBotScore();
    if (botCheck.isBot) {
      return { success: false, error: 'Access denied.' };
    }

    // Validate inputs
    const step = typeof stepCount === 'number' && Number.isInteger(stepCount) && stepCount >= 0 && stepCount <= 20
      ? stepCount
      : 0;

    const answers = typeof previousAnswers === 'object' && previousAnswers !== null
      ? previousAnswers as Record<string, unknown>
      : {};

    const industry = typeof answers.industry === 'string'
      ? answers.industry.slice(0, 100)
      : 'General Business';

    return handleFallback(step, industry);
  } catch {
    return handleFallback(0, 'General Business');
  }
}

/**
 * Local question bank used as fallback when AI is unavailable.
 */
function handleFallback(stepCount: number, industry: string = 'General Business') {
  const bank: Record<number, { title: string; description: string; options: string[] }> = {
    0: {
      title: 'What industry are you in?',
      description: 'Industry determines your primary compliance framework.',
      options: ['Financial Services', 'Healthcare & Life Sciences', 'Legal / Professional Services', 'Technology / SaaS'],
    },
    1: {
      title: 'How do you classify sensitive data?',
      description: 'Data classification is a core security policy requirement.',
      options: ['Strictly Confidential', 'Internal Only', 'Public', 'Not classified'],
    },
    2: {
      title: 'Which encryption standard is in use?',
      description: 'Encryption at rest is a standard legal requirement.',
      options: ['AES-256 (Military Grade)', 'Standard TLS', 'Legacy WEP', 'None / Plaintext'],
    },
    3: {
      title: 'What is your Incident Response timeframe?',
      description: 'GDPR requires breach notification within 72 hours.',
      options: ['Under 2 hours', 'Within 24 hours', 'Under 72 hours (GDPR)', 'Best effort'],
    },
    4: {
      title: 'How are access logs reviewed?',
      description: 'Audit trails are critical for forensic compliance.',
      options: ['Daily Automated', 'Weekly Manual', 'On-demand only', 'No logging'],
    },
    5: {
      title: 'Where is your primary data center?',
      description: 'Jurisdiction affects data residency laws.',
      options: ['European Union (GDPR Zone)', 'United States', 'Multi-region Global', 'Local On-premise'],
    },
    6: {
      title: 'Who has admin access to databases?',
      description: 'Principle of Least Privilege is a core audit point.',
      options: ['Designated Security Admins', 'All Engineering staff', 'Third-party vendors', 'Shared root access'],
    },
    7: {
      title: 'How often are vulnerability scans run?',
      description: 'Proactive security scanning is a baseline requirement.',
      options: ['Continuous Real-time', 'Weekly Scheduled', 'Quarterly Audit', 'Annually / Never'],
    },
    8: {
      title: 'Is staff trained on phishing attacks?',
      description: 'Human factors are the number one compliance risk.',
      options: ['Yes, Quarterly Training', 'Annually', 'Onboarding only', 'No formal training'],
    },
    9: {
      title: 'Are backups stored in immutable storage?',
      description: 'Immutable backups protect against ransomware attacks.',
      options: ['Yes (WORM / Immutable)', 'Standard Cloud Backup', 'Local Tape / NAS', 'No backup policy'],
    },
  };

  const fallback = bank[stepCount] ?? bank[0];
  return {
    success: true,
    data: { id: 'fallback_' + stepCount, ...fallback },
  };
}
