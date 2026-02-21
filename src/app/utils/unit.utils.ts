/**
 * Fator de conversão oficial: 1 lb = 0.45359237 kg
 */
export const LB_TO_KG_FACTOR = 0.45359237;

/**
 * Converte Libras (lb) para Quilogramas (kg)
 * @param lb Valor em libras
 * @returns Valor em kg
 */
export function lbToKg(lb: number): number {
    if (isNaN(lb) || lb < 0) return 0;
    return lb * LB_TO_KG_FACTOR;
}

/**
 * Converte Quilogramas (kg) para Libras (lb)
 * @param kg Valor em kg
 * @returns Valor em lb
 */
export function kgToLb(kg: number): number {
    if (isNaN(kg) || kg < 0) return 0;
    return kg / LB_TO_KG_FACTOR;
}

/**
 * Arredonda um peso para exibição.
 * - kg: geralmente 0 ou 1 casa decimal
 * - lb: 1 casa decimal
 * @param value Valor a ser arredondado
 * @param unit Unidade do valor
 * @returns Valor arredondado
 */
export function roundWeight(value: number, unit: 'kg' | 'lb'): number {
    if (isNaN(value)) return 0;
    
    if (unit === 'lb') {
        // lb: 1 casa decimal (ex: 88.2)
        return Math.round(value * 10) / 10;
    } else {
        // kg: tentar manter sem casas se for inteiro, senão 1 casa
        const rounded1Decimal = Math.round(value * 10) / 10;
        if (Number.isInteger(rounded1Decimal)) {
             return Math.round(value);
        }
        return rounded1Decimal;
    }
}

/**
 * Formata o peso com a unidade para visualização (ex: "40 kg" ou "88.2 lb")
 * @param value Valor bruto (será arredondado)
 * @param unit Unidade
 * @returns String formatada
 */
export function formatWeight(value: number, unit: 'kg' | 'lb'): string {
    const rounded = roundWeight(value, unit);
    return `${rounded} ${unit}`;
}
