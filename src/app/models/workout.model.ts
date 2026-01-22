/**
 * Representa um set individual parseado (ex: "3x10" ou "15" ou "F")
 */
export interface ParsedSet {
    label: string;      // ex: "1ª", "2ª", "3ª"
    reps: string;       // ex: "10", "15", "F", "8a12"
    isFailure: boolean; // true se for "F" (falha)
}

/**
 * Representa um exercício individual
 */
export interface Exercise {
    description: string;
    series: string;
    weights?: number[];  // Array de pesos para cada set (quando há +)
    weight?: number;     // Manter para retrocompatibilidade
    completed?: boolean;
}

/**
 * Item de exercício pode ser um exercício único ou um grupo (bi-set, tri-set, etc.)
 * - Exercício único: objeto Exercise
 * - Bi-set/Tri-set/etc: array de Exercise[]
 */
export type ExerciseItem = Exercise | Exercise[];

/**
 * Representa um treino completo (ex: Treino A, Treino B, etc.)
 */
export interface Workout {
    id: string;
    name: string;
    exercices: ExerciseItem[];
}

/**
 * Estrutura raiz do JSON de treinos
 */
export interface WorkoutData {
    days: Workout[];
}

/**
 * Estado do treino ativo
 */
export interface ActiveWorkoutState {
    workoutId: string;
    startTime: number;
    elapsedSeconds: number;
    completedExercises: Set<string>;
}

/**
 * Helper para verificar se um item é um grupo de exercícios (bi-set, tri-set, etc.)
 */
export function isExerciseGroup(item: ExerciseItem): item is Exercise[] {
    return Array.isArray(item);
}

/**
 * Conta o número de itens de exercício (bi-set/tri-set conta como 1)
 * Usado na tela inicial para mostrar o total de "blocos" de exercício
 */
export function countExercises(exercices: ExerciseItem[]): number {
    return exercices.length;
}

/**
 * Conta o total de exercícios individuais (inclui todos os exercícios dentro de grupos)
 * Usado na tela de detalhes para contar exercícios concluídos
 */
export function countTotalExercises(exercices: ExerciseItem[]): number {
    return exercices.reduce((total, item) => {
        if (isExerciseGroup(item)) {
            return total + item.length;
        }
        return total + 1;
    }, 0);
}

/**
 * Retorna o nome do grupo baseado na quantidade de exercícios
 */
export function getGroupName(count: number): string {
    switch (count) {
        case 2: return 'BI-SET';
        case 3: return 'TRI-SET';
        case 4: return 'GIANT-SET';
        default: return `${count}-SET`;
    }
}

/**
 * Verifica se uma série tem múltiplos sets (contém +)
 * Ex: "3x10+15" -> true, "3x10" -> false
 */
export function hasMultipleSets(series: string): boolean {
    return series.includes('+');
}

/**
 * Parseia uma string de séries e retorna os sets individuais
 * Ex: "3x10+15" -> [{label: "1ª", reps: "3x10"}, {label: "2ª", reps: "15"}]
 * Ex: "3x10+15+F" -> [{label: "1ª", reps: "3x10"}, {label: "2ª", reps: "15"}, {label: "3ª", reps: "F"}]
 * Ex: "4x12" -> [{label: "", reps: "4x12"}]
 */
export function parseSeries(series: string): ParsedSet[] {
    if (!hasMultipleSets(series)) {
        return [{
            label: '',
            reps: series,
            isFailure: series.toUpperCase() === 'F'
        }];
    }

    const parts = series.split('+');
    const ordinals = ['1ª', '2ª', '3ª', '4ª', '5ª'];

    return parts.map((part, index) => {
        const trimmed = part.trim();
        return {
            label: ordinals[index] || `${index + 1}ª`,
            reps: trimmed,
            isFailure: trimmed.toUpperCase() === 'F'
        };
    });
}

/**
 * Conta o número de sets que precisam de peso (exclui sets de falha)
 */
export function countWeightSets(series: string): number {
    const sets = parseSeries(series);
    return sets.filter(s => !s.isFailure).length;
}

