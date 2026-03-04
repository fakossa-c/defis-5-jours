/**
 * Epic Narrative Schema (Client-Friendly Format)
 *
 * Defines the structure of transformed epic narratives
 * This is the OUTPUT format after transformation
 */

import { z } from 'zod'

// Progress tracking
export const ProgressSchema = z.object({
  completed: z.number().int().min(0),
  total: z.number().int().positive(),
  percentage: z.number().int().min(0).max(100),
})

// Single story narrative (client-friendly)
export const StoryNarrativeSchema = z.object({
  id: z.string().regex(/^story-\d+\.\d+$/).describe('Story ID (e.g., "story-2.1")'),
  title: z.string().min(1).describe('Client-friendly story title'),
  description: z.string().min(1).describe('What this means for the client'),
  status: z.enum(['completed', 'in_progress', 'planned']),
})

// Insight from retrospective or achievements
export const InsightSchema = z.object({
  type: z.enum(['success', 'learning', 'milestone']),
  title: z.string().min(1).describe('Short insight title'),
  description: z.string().min(1).describe('Client-friendly explanation'),
})

// Transformation metadata
export const NarrativeMetaSchema = z.object({
  sourceEpic: z.number().positive(),
  transformedAt: z.string().datetime({ offset: true }),
  transformedBy: z.literal('epic-narrative-formatter'),
  language: z.string().default('Français'),
  tone: z.enum(['professional', 'friendly', 'concise']).default('professional'),
})

// Full epic narrative (what gets sent to CRM)
export const EpicNarrativeSchema = z.object({
  id: z.string().regex(/^epic-\d+$/).describe('Epic ID (e.g., "epic-2")'),
  title: z.string().min(1).describe('Client-friendly epic title'),
  why: z.string().min(1).describe('Business value explanation using "vous"'),
  status: z.enum(['completed', 'in_progress', 'planned']),
  deliveryDate: z.string().date().nullable().describe('Delivery date or null'),
  progress: ProgressSchema,
  stories: z.array(StoryNarrativeSchema).min(1),
  insights: z.array(InsightSchema).default([]),
  meta: NarrativeMetaSchema.optional(),
})

// Type exports
export type Progress = z.infer<typeof ProgressSchema>
export type StoryNarrative = z.infer<typeof StoryNarrativeSchema>
export type Insight = z.infer<typeof InsightSchema>
export type NarrativeMeta = z.infer<typeof NarrativeMetaSchema>
export type EpicNarrative = z.infer<typeof EpicNarrativeSchema>

/**
 * Validation helper
 */
export function validateNarrative(data: unknown): EpicNarrative {
  return EpicNarrativeSchema.parse(data)
}

/**
 * Safe validation (returns result object)
 */
export function safeValidateNarrative(data: unknown) {
  return EpicNarrativeSchema.safeParse(data)
}

/**
 * Example narrative output:
 *
 * {
 *   "id": "epic-2",
 *   "title": "Authentification et gestion de compte",
 *   "why": "Pour que vous puissiez accéder à vos projets en toute sécurité et gérer vos informations personnelles, nous avons construit un système d'authentification complet.",
 *   "status": "completed",
 *   "deliveryDate": "2026-01-03",
 *   "progress": {
 *     "completed": 11,
 *     "total": 11,
 *     "percentage": 100
 *   },
 *   "stories": [
 *     {
 *       "id": "story-2.1",
 *       "title": "Connexion et déconnexion",
 *       "description": "Page de connexion sécurisée avec email et mot de passe, redirection automatique vers votre tableau de bord",
 *       "status": "completed"
 *     }
 *   ],
 *   "insights": [
 *     {
 *       "type": "success",
 *       "title": "Sécurité renforcée",
 *       "description": "Tests automatisés garantissent que seuls les utilisateurs authentifiés accèdent à leurs données."
 *     }
 *   ],
 *   "meta": {
 *     "sourceEpic": 2,
 *     "transformedAt": "2026-01-19T14:45:00+00:00",
 *     "transformedBy": "epic-narrative-formatter",
 *     "language": "Français",
 *     "tone": "professional"
 *   }
 * }
 */
