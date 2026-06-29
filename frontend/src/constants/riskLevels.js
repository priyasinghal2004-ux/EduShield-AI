// TODO: Risk level label and threshold constants.
// Responsibilities:
//   - Define score thresholds for each risk tier
//   - Map each tier to a label, color class, and display text
//   - Used by RiskScoreBadge, riskHelpers, and StudentTable

export const RISK_LEVELS = {
  LOW:      { label: 'Low',      min: 0.0, max: 0.39 },
  MEDIUM:   { label: 'Medium',   min: 0.4, max: 0.59 },
  HIGH:     { label: 'High',     min: 0.6, max: 0.79 },
  CRITICAL: { label: 'Critical', min: 0.8, max: 1.0  },
}
