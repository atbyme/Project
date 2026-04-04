// Global type declarations for Puter.js browser SDK
// Loaded via CDN in layout.tsx: https://js.puter.com/v2/

interface PuterAIResponse {
  message: { content: string; role: string };
}

interface Puter {
  ai: {
    chat(prompt: string, options?: { model?: string; stream?: boolean }): Promise<PuterAIResponse | string>;
  };
  auth: {
    isSignedIn(): Promise<boolean>;
    signIn(): Promise<void>;
    signOut(): Promise<void>;
  };
}

declare global {
  interface Window { puter: Puter; }
}

export {};
