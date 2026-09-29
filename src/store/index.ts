// =============================================================================
// BUILTIT AI - Global App Store (Zustand)
// =============================================================================

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthSession, User, UIState, Notification, WorkspaceState, Project, UploadedImage, DiagramAnalysis } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// ---------------------------------------------------------------------------
// Auth Store
// ---------------------------------------------------------------------------

interface AuthStore {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  get user(): User | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      loading: false,
      error: null,
      setSession: (session) => set({ session, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      logout: () => set({ session: null, error: null }),
      get user() {
        return get().session?.user ?? null;
      },
    }),
    {
      name: 'builtit-auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ session: state.session }),
    }
  )
);

// ---------------------------------------------------------------------------
// UI Store
// ---------------------------------------------------------------------------

interface UIStore extends UIState {
  setSidebar: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  notify: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
  };
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebar: true,
      theme: 'system',
      activeModal: null,
      notifications: [],
      setSidebar: (sidebar) => set({ sidebar }),
      toggleSidebar: () => set((s) => ({ sidebar: !s.sidebar })),
      setTheme: (theme) => set({ theme }),
      openModal: (activeModal) => set({ activeModal }),
      closeModal: () => set({ activeModal: null }),
      addNotification: (notification) => {
        const n: Notification = { ...notification, id: uuidv4(), createdAt: new Date() };
        set((s) => ({ notifications: [n, ...s.notifications].slice(0, 5) }));
        if (n.duration !== 0) {
          setTimeout(() => get().removeNotification(n.id), n.duration ?? 5000);
        }
      },
      removeNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      clearNotifications: () => set({ notifications: [] }),
      notify: {
        success: (title, message) =>
          get().addNotification({ type: 'success', title, message }),
        error: (title, message) =>
          get().addNotification({ type: 'error', title, message, duration: 8000 }),
        warning: (title, message) =>
          get().addNotification({ type: 'warning', title, message }),
        info: (title, message) =>
          get().addNotification({ type: 'info', title, message }),
      },
    }),
    {
      name: 'builtit-ui',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
      partialize: (state) => ({ sidebar: state.sidebar, theme: state.theme }),
    }
  )
);

// ---------------------------------------------------------------------------
// Workspace Store
// ---------------------------------------------------------------------------

interface WorkspaceStore extends WorkspaceState {
  setProject: (project: Project | null) => void;
  setActiveImage: (image: UploadedImage | null) => void;
  setActiveAnalysis: (analysis: DiagramAnalysis | null) => void;
  setActiveTab: (tab: WorkspaceState['activeTab']) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  selectElement: (id: string) => void;
  deselectElement: (id: string) => void;
  clearSelection: () => void;
  toggleLayer: (layerId: string) => void;
  toggleGrid: () => void;
  toggleMeasurements: () => void;
  resetViewport: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()((set) => ({
  project: null,
  activeImage: null,
  activeAnalysis: null,
  activeTab: 'analysis',
  zoom: 1,
  panX: 0,
  panY: 0,
  selectedElementIds: [],
  visibleLayers: [],
  showGrid: false,
  showMeasurements: true,
  setProject: (project) => set({ project }),
  setActiveImage: (activeImage) => set({ activeImage }),
  setActiveAnalysis: (activeAnalysis) => set({
    activeAnalysis,
    visibleLayers: activeAnalysis?.layers.map((l) => l.id) ?? [],
  }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.1), 10) }),
  setPan: (panX, panY) => set({ panX, panY }),
  selectElement: (id) => set((s) => ({
    selectedElementIds: s.selectedElementIds.includes(id)
      ? s.selectedElementIds
      : [...s.selectedElementIds, id],
  })),
  deselectElement: (id) => set((s) => ({
    selectedElementIds: s.selectedElementIds.filter((eid) => eid !== id),
  })),
  clearSelection: () => set({ selectedElementIds: [] }),
  toggleLayer: (layerId) => set((s) => ({
    visibleLayers: s.visibleLayers.includes(layerId)
      ? s.visibleLayers.filter((l) => l !== layerId)
      : [...s.visibleLayers, layerId],
  })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleMeasurements: () => set((s) => ({ showMeasurements: !s.showMeasurements })),
  resetViewport: () => set({ zoom: 1, panX: 0, panY: 0 }),
}));
