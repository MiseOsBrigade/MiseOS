import { create } from 'zustand';
import type { DimensionMode, RepositoryAsset } from '../types';

interface PlaygroundState {
  dimension: DimensionMode;
  query: string;
  selectedAsset: RepositoryAsset | null;
  hoveredAssetId: string | null;
  activeViewerId: string | null;
  setDimension: (dimension: DimensionMode) => void;
  setQuery: (query: string) => void;
  selectAsset: (asset: RepositoryAsset | null) => void;
  hoverAsset: (id: string | null) => void;
  activateViewer: (id: string | null) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  dimension: 'evidence',
  query: '',
  selectedAsset: null,
  hoveredAssetId: null,
  activeViewerId: null,
  setDimension: (dimension) => set({ dimension }),
  setQuery: (query) => set({ query }),
  selectAsset: (selectedAsset) => set({ selectedAsset }),
  hoverAsset: (hoveredAssetId) => set({ hoveredAssetId }),
  activateViewer: (activeViewerId) => set({ activeViewerId }),
}));
