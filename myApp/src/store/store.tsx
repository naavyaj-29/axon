import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';

const initialState = {
  dashboard: {
    cognitiveLoad: { value: 68, label: 'Cognitive Load', trend: '+4%', status: 'elevated' },
    mentalClarity: { value: 74, label: 'Mental Clarity', trend: '+6%', status: 'good' },
    emotionalRecovery: { value: 81, label: 'Emotional Recovery', trend: '+11%', status: 'good' },
    stressLoad: { value: 52, label: 'Stress Load', trend: '-3%', status: 'moderate' },
    entriesThisWeek: 12, streakDays: 7, isRefreshing: false,
  },
  charts: {
    cognitiveLoadWeek: [45, 52, 48, 58, 52, 45, 40],
    recoveryWeek: [65, 72, 58, 70, 68, 74, 81],
    stressWeek: [35, 28, 42, 30, 32, 26, 19],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  entry: { type: null, textContent: '', audioPath: null, videoPath: null, isAnalyzing: false, analysisComplete: false, error: null },
  insight: 'Your recovery trend is improving. Stress load decreased by 12% this week.',
};

// Fix: added types to state and action
function reducer(state: any, action: any) {
  switch (action.type) {
    case 'DASHBOARD_REFRESH_START': return { ...state, dashboard: { ...state.dashboard, isRefreshing: true } };
    case 'DASHBOARD_REFRESH_DONE':  return { ...state, dashboard: { ...state.dashboard, ...action.payload, isRefreshing: false } };
    case 'ENTRY_SET_TYPE':          return { ...state, entry: { ...initialState.entry, type: action.payload } };
    case 'ENTRY_SET_TEXT':          return { ...state, entry: { ...state.entry, textContent: action.payload } };
    case 'ENTRY_SET_AUDIO':         return { ...state, entry: { ...state.entry, audioPath: action.payload } };
    case 'ENTRY_SET_VIDEO':         return { ...state, entry: { ...state.entry, videoPath: action.payload } };
    case 'ENTRY_ANALYSIS_START':    return { ...state, entry: { ...state.entry, isAnalyzing: true, error: null } };
    case 'ENTRY_ANALYSIS_DONE':     return { ...state, entry: { ...state.entry, isAnalyzing: false, analysisComplete: true } };
    case 'ENTRY_RESET':             return { ...state, entry: { ...initialState.entry } };
    case 'ENTRY_ERROR':             return { ...state, entry: { ...state.entry, isAnalyzing: false, error: action.payload } };
    default: return state;
  }
}

// Fix: typed Context as <any>
const AppContext = createContext<any>(null);

// Fix: typed children
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshDashboard = useCallback(async () => {
    dispatch({ type: 'DASHBOARD_REFRESH_START' });
    await new Promise(r => setTimeout(r, 1200));
    dispatch({ type: 'DASHBOARD_REFRESH_DONE', payload: {} });
  }, []);

  const setEntryType  = useCallback((type: any) => dispatch({ type: 'ENTRY_SET_TYPE', payload: type }), []);
  const setEntryText  = useCallback((text: any) => dispatch({ type: 'ENTRY_SET_TEXT', payload: text }), []);
  const setEntryAudio = useCallback((path: any) => dispatch({ type: 'ENTRY_SET_AUDIO', payload: path }), []);
  const setEntryVideo = useCallback((path: any) => dispatch({ type: 'ENTRY_SET_VIDEO', payload: path }), []);
  
  const analyzeEntry = useCallback(async () => {
    dispatch({ type: 'ENTRY_ANALYSIS_START' });
    await new Promise(r => setTimeout(r, 3500));
    dispatch({ type: 'ENTRY_ANALYSIS_DONE' });
  }, []);
  const resetEntry = useCallback(() => dispatch({ type: 'ENTRY_RESET' }), []);

  const actions = useMemo(() => ({
    refreshDashboard, setEntryType, setEntryText, setEntryAudio, setEntryVideo, analyzeEntry, resetEntry
  }), [refreshDashboard, setEntryType, setEntryText, setEntryAudio, setEntryVideo, analyzeEntry, resetEntry]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useStore must be used within AppProvider');
  return ctx;
}