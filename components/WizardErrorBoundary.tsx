'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WizardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[WizardError]', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center space-y-4 py-20">
          <p className="text-lg font-medium text-foreground/60">The wizard encountered an error.</p>
          <button
            onClick={() => {
              sessionStorage.removeItem('wizard_state');
              window.location.reload();
            }}
            className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all"
          >
            Start Fresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
