import { create } from "zustand";
import type {
  PantryItem,
  GeneratedRecipe,
  MacroTarget,
  CoachMessage,
  MuscleGroupActivation,
  RecoveryStatus,
} from "@/types/dashboard";

interface ApexFitState {
  // --- Recovery / header ---
  recovery: RecoveryStatus;

  // --- Pantry-to-Plate ---
  pantryItems: PantryItem[];
  togglePantryItem: (id: string) => void;
  generatedRecipe: GeneratedRecipe | null;
  isGeneratingRecipe: boolean;
  generateRecipe: () => Promise<void>;

  // --- 3D Visualizer ---
  muscleActivation: MuscleGroupActivation[];
  projectedMassGainKg: number;
  setProjectedMassGainKg: (kg: number) => void;

  // --- AI Coach HUD ---
  isCameraLive: boolean;
  setCameraLive: (live: boolean) => void;
  formQualityPercent: number;
  fps: number;
  coachTranscript: CoachMessage[];
  pushCoachMessage: (msg: Omit<CoachMessage, "id" | "timestamp">) => void;

  // --- Macro bar / bottom ---
  isVoiceListening: boolean;
  setVoiceListening: (v: boolean) => void;
  macros: MacroTarget[];
  circadianWindowMinutesLeft: number;
}

export const useApexFitStore = create<ApexFitState>((set, get) => ({
  recovery: {
    hrvScore: 82,
    recoveryPercent: 88,
    streakDays: 14,
  },

  pantryItems: [
    { id: "eggs", name: "Eggs", selected: true, proteinPer100g: 13, kcalPer100g: 155 },
    { id: "spinach", name: "Spinach", selected: true, proteinPer100g: 2.9, kcalPer100g: 23 },
    { id: "oats", name: "Oats", selected: false, proteinPer100g: 13.5, kcalPer100g: 389 },
    { id: "chicken", name: "Chicken Breast", selected: true, proteinPer100g: 31, kcalPer100g: 165 },
  ],
  togglePantryItem: (id) =>
    set((state) => ({
      pantryItems: state.pantryItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      ),
    })),

  generatedRecipe: {
    id: "seed-omelet",
    title: "Macro-Matched High-Protein Omelet",
    kcal: 420,
    proteinG: 34,
    carbsG: 8,
    fatG: 26,
    usedIngredients: ["eggs", "spinach", "chicken"],
    steps: [
      "Whisk 3 eggs with a splash of water; season.",
      "Sauté diced chicken breast until cooked through.",
      "Wilt spinach in the same pan, then add eggs.",
      "Fold over chicken and spinach, cook to set.",
    ],
  },
  isGeneratingRecipe: false,
  generateRecipe: async () => {
    set({ isGeneratingRecipe: true });
    try {
      const selectedIds = get()
        .pantryItems.filter((i) => i.selected)
        .map((i) => i.id);
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientIds: selectedIds }),
      });
      const recipe: GeneratedRecipe = await res.json();
      set({ generatedRecipe: recipe });
    } finally {
      set({ isGeneratingRecipe: false });
    }
  },

  muscleActivation: [
    { group: "quads", intensity: 0.9 },
    { group: "glutes", intensity: 0.85 },
    { group: "hamstrings", intensity: 0.5 },
    { group: "calves", intensity: 0.3 },
    { group: "core", intensity: 0.4 },
    { group: "back", intensity: 0.2 },
    { group: "chest", intensity: 0.15 },
    { group: "shoulders", intensity: 0.15 },
    { group: "arms", intensity: 0.2 },
  ],
  projectedMassGainKg: 2,
  setProjectedMassGainKg: (kg) => set({ projectedMassGainKg: kg }),

  isCameraLive: true,
  setCameraLive: (live) => set({ isCameraLive: live }),
  formQualityPercent: 94,
  fps: 60,
  coachTranscript: [
    { id: "c1", role: "coach", text: "Nice depth on that squat. Keep your chest tall.", timestamp: Date.now() - 8000 },
    { id: "c2", role: "coach", text: "Drive through your heels on the way up.", timestamp: Date.now() - 3000 },
  ],
  pushCoachMessage: (msg) =>
    set((state) => ({
      coachTranscript: [
        ...state.coachTranscript,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ].slice(-20),
    })),

  isVoiceListening: false,
  setVoiceListening: (v) => set({ isVoiceListening: v }),
  macros: [
    { label: "Protein", currentG: 132, targetG: 180, colorClass: "bg-signal" },
    { label: "Carbs", currentG: 210, targetG: 350, colorClass: "bg-ember" },
    { label: "Fat", currentG: 48, targetG: 80, colorClass: "bg-ink-muted" },
  ],
  circadianWindowMinutesLeft: 45,
}));
