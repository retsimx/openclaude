import { getFeatureValue_CACHED_MAY_BE_STALE } from '../services/analytics/growthbook.js'
import { isEnvTruthy } from './envUtils.js'

/**
 * Check if --agent-teams flag is provided via CLI.
 * Checks process.argv directly to avoid import cycles with bootstrap/state.
 * Note: The flag is only shown in help for ant users, but if external users
 * pass it anyway, it will work (subject to the killswitch).
 */
function isAgentTeamsFlagSet(): boolean {
  return process.argv.includes('--agent-teams')
}

/**
 * Centralized runtime check for agent teams/teammate features.
 * This is the single gate that should be checked everywhere teammates
 * are referenced (prompts, code, tools isEnabled, UI, etc.).
 *
 * Enabled by default for all users.
 * Can be disabled via CLAUDE_CODE_DISABLE_AGENT_TEAMS env var.
 */
export function isAgentSwarmsEnabled(): boolean {
  // Disabled via env var
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_AGENT_TEAMS)) {
    return false
  }

  // Killswitch — GrowthBook gate for emergency disable
  if (!getFeatureValue_CACHED_MAY_BE_STALE('tengu_amber_flint', true)) {
    return false
  }

  return true
}
