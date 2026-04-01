'use server';

import { headers } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

/**
 * Log Report Download (The Security Audit Log)
 * Captures device history and IP for buyer confidence.
 */
export async function logReportDownload(reportTitle: string) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Unknown Device';
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'localhost';
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action: 'PDF_DOWNLOAD',
      report: reportTitle,
      device: userAgent,
      ip_v4: ip,
      status: 'SUCCESS'
    };

    // [SERVERLESS-SAFE] Special handling for Vercel:
    // Vercel does NOT allow permanent file writing. We log to console for 
    // real-time monitoring and use /tmp for temporary session persistence.
    const logPath = path.join('/tmp', 'audit-log.json');
    
    let currentLogs = [];
    try {
      const data = await fs.readFile(logPath, 'utf8');
      currentLogs = JSON.parse(data);
    } catch (e) {
      // File doesn't exist yet or is inaccessible
    }

    currentLogs.push(logEntry);
    
    // Attempt to write for the session (might not persist cross-restarts on Vercel)
    try {
      await fs.writeFile(logPath, JSON.stringify(currentLogs, null, 2));
    } catch (e) {
      // Silent fail for file-system restricted environments
    }

    console.log(`[AUDIT-LOG] ${ip} | ${userAgent} | ${reportTitle}`);
    
    return { success: true, log: logEntry };
  } catch (error) {
    console.error('Audit Log Error:', error);
    return { success: false };
  }
}
