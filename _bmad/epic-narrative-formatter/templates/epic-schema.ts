/**
 * Epic Source Schema (BMAD Format)
 *
 * Defines the structure of parsed BMAD epic metadata
 * This is the INPUT format before transformation
 */

import { z } from 'zod'

// User story structure
export const UserStorySchema = z.object({
  role: z.string().describe('The user role (e.g., "user", "admin")'),
  want: z.string().describe('What the user wants to do'),
  soThat: z.string().describe('The benefit or reason'),
})

// Single story within an epic
export const StoryMetadataSchema = z.object({
  number: z.string().describe('Story number (e.g., "2.1", "2.2")'),
  title: z.string().describe('Technical story title'),
  userStory: UserStorySchema.optional().describe('Parsed user story'),
  acceptanceCriteria: z.array(z.string()).describe('List of acceptance criteria'),
  technicalNotes: z.string().optional().describe('Implementation notes'),
  status: z.enum(['completed', 'in_progress', 'planned']).default('planned'),
})

// Retrospective data (if available)
export const RetrospectiveSchema = z.object({
  available: z.boolean(),
  whatWentWell: z.array(z.string()).optional(),
  lessonsLearned: z.array(z.string()).optional(),
  metrics: z
    .object({
      tests: z.number().optional(),
      coverage: z.string().optional(),
    })
    .optional(),
})

// Full epic metadata (parsed from epic-list.md)
export const EpicMetadataSchema = z.object({
  epicNumber: z.number().positive().describe('Epic number'),
  title: z.string().min(1).describe('Epic title'),
  goal: z.string().min(1).describe('Epic goal statement'),
  frs_covered: z.string().optional().describe('Functional requirements covered'),
  deliverables: z.array(z.string()).describe('Key deliverables'),
  stories: z.array(StoryMetadataSchema).min(1).describe('Stories in this epic'),
  retrospective: RetrospectiveSchema.optional(),
  parsedAt: z.string().datetime({ offset: true }).describe('ISO timestamp'),
})

// Type exports
export type UserStory = z.infer<typeof UserStorySchema>
export type StoryMetadata = z.infer<typeof StoryMetadataSchema>
export type Retrospective = z.infer<typeof RetrospectiveSchema>
export type EpicMetadata = z.infer<typeof EpicMetadataSchema>

/**
 * Example parsed metadata:
 *
 * {
 *   "epicNumber": 2,
 *   "title": "Authentication & User Management",
 *   "goal": "Users can create accounts, authenticate...",
 *   "frs_covered": "FR12, FR38-FR45b, FR63-FR66 (16 FRs)",
 *   "deliverables": [
 *     "Supabase Auth integration (email/password)",
 *     "Profile settings page"
 *   ],
 *   "stories": [
 *     {
 *       "number": "2.1",
 *       "title": "Login Page & Auth Flow",
 *       "userStory": {
 *         "role": "user",
 *         "want": "to log in with my email and password",
 *         "soThat": "I can access my dashboard and projects"
 *       },
 *       "acceptanceCriteria": [
 *         "Given I am on the login page, When I enter valid credentials..."
 *       ],
 *       "technicalNotes": "FR12 compliance, Use shadcn/ui",
 *       "status": "completed"
 *     }
 *   ],
 *   "retrospective": {
 *     "available": true,
 *     "whatWentWell": ["TDD discipline established"],
 *     "lessonsLearned": ["Start with architecture decisions"]
 *   },
 *   "parsedAt": "2026-01-19T14:30:00+00:00"
 * }
 */
