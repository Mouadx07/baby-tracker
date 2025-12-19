import { StyleSheet } from 'react-native';
import { colors } from './colors';

// Elite UI Styles - Tailwind-inspired utilities
export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  
  // Backgrounds
  bgWhite: {
    backgroundColor: colors.white,
  },
  bgGray50: {
    backgroundColor: colors.gray50,
  },
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  
  // Padding
  p4: { padding: 16 },
  p6: { padding: 24 },
  px4: { paddingHorizontal: 16 },
  px6: { paddingHorizontal: 24 },
  py3: { paddingVertical: 12 },
  py4: { paddingVertical: 16 },
  
  // Margins
  mb2: { marginBottom: 8 },
  mb4: { marginBottom: 16 },
  mb6: { marginBottom: 24 },
  mb8: { marginBottom: 32 },
  mt2: { marginTop: 8 },
  
  // Typography
  textBase: {
    fontSize: 16,
    color: colors.gray800,
  },
  textLg: {
    fontSize: 18,
  },
  text2xl: {
    fontSize: 24,
  },
  text3xl: {
    fontSize: 28,
  },
  textBold: {
    fontWeight: 'bold',
  },
  textSemibold: {
    fontWeight: '600',
  },
  textCenter: {
    textAlign: 'center',
  },
  textGray700: {
    color: colors.gray700,
  },
  textWhite: {
    color: colors.white,
  },
  
  // Borders & Rounded
  rounded: {
    borderRadius: 8,
  },
  roundedXl: {
    borderRadius: 12,
  },
  rounded3xl: {
    borderRadius: 24,
  },
  border: {
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  
  // Shadows (Elite UI)
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
});

// Pre-composed Elite UI Components
export const eliteStyles = StyleSheet.create({
  // Input field with frosted glass effect
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.gray50,
    color: colors.gray800,
  },
  
  // Primary action button
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Glass card effect
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  
  // Label text
  label: {
    color: colors.gray700,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

