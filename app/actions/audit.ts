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

    // For the MVP, we log to a local JSON file to show the buyer "Audit Persistence"
    const logPath = path.join(process.cwd(), 'audit-log.json');
    
    let currentLogs = [];
    try {
      const data = await fs.readFile(logPath, 'utf8');
      currentLogs = JSON.parse(data);
    } catch (e) {
      // File doesn't exist yet
    }

    currentLogs.push(logEntry);
    await fs.writeFile(logPath, JSON.stringify(currentLogs, null, 2));

    console.log(`[AUDIT] Report Downloaded: ${reportTitle} | IP: ${ip} | Device: ${userAgent}`);
    
    return { success: true, log: logEntry };
  } catch (error) {
    console.error('Audit Log Error:', error);
    return { success: false };
  }
}
