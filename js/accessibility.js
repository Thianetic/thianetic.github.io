// Accessibility Menu (Native Popover API) & State Persistence Manager
import { ACCESSIBILITY_OPTIONS, DEFAULT_ACCESSIBILITY_STATE } from './config.js';
import { nextAccessibilityState, applyAccessibilityDomState } from './utils.js';

const STORAGE_KEY = 'thianetic_a11y';

export class AccessibilityManager {
    constructor(bus) {
        this.bus = bus;
        this.accessibilityBtn = null;
        this.accessibilityMenu = null;
        this.resetBtn = null;
        this.accessStates = { ...DEFAULT_ACCESSIBILITY_STATE };
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.accessibilityBtn = document.getElementById('accessibility-btn');
        this.accessibilityMenu = document.getElementById('accessibility-menu');
        this.resetBtn = document.getElementById('reset-access');

        this.loadSavedState();
        this.applyAllStates();

        if (!this.accessibilityMenu) return;

        // Native Popover API toggle synchronization
        this.accessibilityMenu.addEventListener('toggle', (e) => {
            if (this.accessibilityBtn) {
                const isOpen = e.newState === 'open';
                this.accessibilityBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            }
        }, { signal });

        // Fallback for environments without native Popover API
        const supportsPopover = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;
        if (!supportsPopover && this.accessibilityBtn) {
            this.accessibilityBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = this.accessibilityMenu.classList.toggle('visible');
                this.accessibilityBtn.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
            }, { signal });
        }

        const actionButtons = this.accessibilityMenu.querySelectorAll('[data-access-action]');
        actionButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-access-action');
                if (action) {
                    this.handleAction(action);
                }
            }, { signal });
        });

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAction('reset');
            }, { signal });
        }
    }

    loadSavedState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                this.accessStates = {
                    ...DEFAULT_ACCESSIBILITY_STATE,
                    ...parsed
                };
            }
        } catch {
            this.accessStates = { ...DEFAULT_ACCESSIBILITY_STATE };
        }
    }

    saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accessStates));
        } catch {
            // Ignore localStorage quota/privacy errors
        }
    }

    handleAction(action) {
        this.accessStates = nextAccessibilityState(this.accessStates, action);
        this.saveState();
        this.applyAllStates();
    }

    applyAllStates() {
        applyAccessibilityDomState(this.accessStates, document.documentElement, ACCESSIBILITY_OPTIONS);

        const paused = Boolean(this.accessStates.animations);
        if (this.bus) {
            this.bus.dispatchEvent(new CustomEvent('ambient:changed', {
                detail: { paused }
            }));
        }

        this.updateUI();
    }

    updateUI() {
        if (!this.accessibilityMenu) return;

        const updateBtn = (action, isActive, labelText) => {
            const btn = this.accessibilityMenu.querySelector(`[data-access-action="${action}"]`);
            if (!btn) return;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            const indicator = btn.querySelector('.level-indicator');
            if (indicator) {
                indicator.textContent = labelText;
            }
        };

        updateBtn(
            'cycle-contrast',
            this.accessStates.contrast > 0,
            ACCESSIBILITY_OPTIONS.contrast.labels[this.accessStates.contrast] || 'Normal'
        );
        updateBtn(
            'toggle-colorblind',
            this.accessStates.colorblind > 0,
            this.accessStates.colorblind > 0 ? 'on' : 'off'
        );
        updateBtn(
            'toggle-links',
            Boolean(this.accessStates.links),
            this.accessStates.links ? 'on' : 'off'
        );
        updateBtn(
            'cycle-textSize',
            this.accessStates.textSize !== DEFAULT_ACCESSIBILITY_STATE.textSize,
            ACCESSIBILITY_OPTIONS.textSize.labels[this.accessStates.textSize] || 'Normal'
        );
        updateBtn(
            'cycle-textAlign',
            this.accessStates.textAlign > 0,
            ACCESSIBILITY_OPTIONS.textAlign.labels[this.accessStates.textAlign] || 'Izquierda'
        );
        updateBtn(
            'cycle-font',
            this.accessStates.font > 0,
            ACCESSIBILITY_OPTIONS.font.labels[this.accessStates.font] || 'Normal'
        );
        updateBtn(
            'toggle-animations',
            Boolean(this.accessStates.animations),
            this.accessStates.animations ? 'on' : 'off'
        );
    }
}
