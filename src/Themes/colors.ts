// Clean and modern theme configuration
export const lightTheme = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    card: '#FFFFFF',
    overlay: 'rgba(15, 23, 42, 0.1)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    inverse: '#FFFFFF',
    success: '#10B981',
    error: '#EF4444',
    disabled: '#94A3B8',
  },
  button: {
    primary: '#3B82F6',
    secondary: '#E2E8F0',
    success: '#10B981',
    danger: '#EF4444',
  },
  border: {
    primary: '#E2E8F0',
    secondary: '#CBD5E1',
    focus: '#3B82F6',
  },
  shadow: {
    primary: '#000000',
  },
  input: {
    background: '#FFFFFF',
    border: '#E2E8F0',
    placeholder: '#94A3B8',
  },
  progress: {
    good: '#10B981',
    bad: '#EF4444',
    background: '#F1F5F9',
  },
  isDarkMode: false,
};

export const darkTheme = {
  background: {
    primary: '#0F172A',
    secondary: '#1E293B',
    tertiary: '#334155',
    card: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    inverse: '#0F172A',
    success: '#10B981',
    error: '#EF4444',
    disabled: '#64748B',
  },
  button: {
    primary: '#3B82F6',
    secondary: '#334155',
    success: '#10B981',
    danger: '#EF4444',
  },
  border: {
    primary: '#334155',
    secondary: '#475569',
    focus: '#3B82F6',
  },
  shadow: {
    primary: '#000000',
  },
  input: {
    background: '#334155',
    border: '#475569',
    placeholder: '#94A3B8',
  },
  progress: {
    good: '#10B981',
    bad: '#EF4444',
    background: '#334155',
  },
  isDarkMode: true,
};

export const getTheme = (isDarkMode: boolean) => {
  return isDarkMode ? darkTheme : lightTheme;
};