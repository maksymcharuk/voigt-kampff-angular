import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

interface VignetteOptions {
  durationMs?: number;
  lingerMs?: number;
}

@Injectable({ providedIn: 'root' })
export class VignetteService {
  private readonly document = inject(DOCUMENT);
  private timeoutId?: number;

  triggerTimeoutVignette(options: VignetteOptions = {}): void {
    const durationMs = options.durationMs ?? 2400;
    const lingerMs = options.lingerMs ?? 1400;
    const root = this.document.documentElement;

    if (!root) {
      return;
    }

    root.classList.add('timeout-vignette');

    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      root.classList.remove('timeout-vignette');
      this.timeoutId = undefined;
    }, durationMs + lingerMs);
  }

  clear(): void {
    const root = this.document.documentElement;
    if (root) {
      root.classList.remove('timeout-vignette');
    }
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
