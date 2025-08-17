import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach , vi } from 'vitest';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockImplementation((query) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
    })),
    writable: true,
});

class ResizeObserver {
    disconnect = () => {};
    observe = () => {};
    unobserve = () => {};
}

window.ResizeObserver = ResizeObserver;

afterEach(() => {
    cleanup();
});
