import { create } from "zustand";
import { tenantsApi } from "@/lib/api/tenants";

interface TaxConfig {
  vatInclusive: boolean;
  taxRate: number;
}

interface TenantSettings {
  id: string;
  name: string;
  taxConfig: TaxConfig;
}

interface SettingsState {
  settings: TenantSettings | null;
  taxRate: number;
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  taxRate: 7.5, // default
  isLoaded: false,

  loadSettings: async () => {
    if (get().isLoaded) return;
    
    try {
      const settings = await tenantsApi.getSettings();
      set({ 
        settings, 
        taxRate: settings.taxConfig?.taxRate || 7.5,
        isLoaded: true 
      });
    } catch (err) {
      console.error("Failed to load settings:", err);
      set({ isLoaded: true });
    }
  },
}));