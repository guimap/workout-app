import { Injectable, signal, computed } from '@angular/core';

export type WeightUnit = 'kg' | 'lb';

const SETTINGS_STORAGE_KEY = 'treino-app-settings';

interface AppSettings {
    unit: WeightUnit;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    // Internal signal holding the state
    private unitSignalValue = signal<WeightUnit>('kg');

    // Public computed property
    readonly unitSignal = computed(() => this.unitSignalValue());

    constructor() {
        this.loadSettings();
    }

    /**
     * Alterna a unidade entre 'kg' e 'lb' e persiste no localStorage.
     * @param targetUnit Opcional. Força uma unidade específica. Se omitido, alterna a atual.
     */
    toggleUnit(targetUnit?: WeightUnit): void {
        const nextUnit = targetUnit || (this.unitSignalValue() === 'kg' ? 'lb' : 'kg');
        this.unitSignalValue.set(nextUnit);
        this.saveSettings();
    }

    /**
     * Retorna a unidade atual (não reativo)
     */
    getCurrentUnit(): WeightUnit {
        return this.unitSignalValue();
    }

    private loadSettings(): void {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
            try {
                const parsed: AppSettings = JSON.parse(stored);
                if (parsed && (parsed.unit === 'kg' || parsed.unit === 'lb')) {
                    this.unitSignalValue.set(parsed.unit);
                }
            } catch (e) {
                console.error('Error parsing settings', e);
            }
        }
    }

    private saveSettings(): void {
        const settings: AppSettings = {
            unit: this.unitSignalValue()
        };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
}
