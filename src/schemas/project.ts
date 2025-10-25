import { z } from 'zod';

// Style Engine Schemas
export const StyleDoctrineSchema = z.object({
  register: z.enum(['formal', 'informal', 'academic', 'conversational']).optional(),
  cadence: z.object({
    avg_sentence_length: z.number().optional(),
    rhythm_pattern: z.string().optional(),
  }).optional(),
  lexicon_prefer: z.array(z.string()).default([]),
  lexicon_avoid: z.array(z.string()).default([]),
  devices_ban: z.array(z.string()).default([]),
  pov_tense: z.object({
    pov: z.enum(['first', 'second', 'third']).optional(),
    tense: z.enum(['past', 'present', 'future']).optional(),
  }).optional(),
});

export const StyleProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  doctrine: StyleDoctrineSchema,
  samples: z.array(z.string()).default([]),
});

// Character Schema
export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  traits: z.array(z.string()).default([]),
  relationships: z.record(z.string()).default({}),
  arc: z.string().optional(),
});

// Location Schema
export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['interior', 'exterior', 'vehicle', 'other']).optional(),
  atmosphere: z.string().optional(),
});

// Timeline Schema
export const TimelineEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  event: z.string(),
  characters: z.array(z.string()).default([]),
  location: z.string().optional(),
});

// Outline Templates
export const OutlineBeatSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  order: z.number(),
  chapter_hint: z.number().optional(),
});

export const OutlineTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  beats: z.array(OutlineBeatSchema),
});

// Scene Schema
export const SceneSchema = z.object({
  id: z.string(),
  chapter_id: z.string(),
  order: z.number(),
  summary: z.string(),
  characters: z.array(z.string()).default([]),
  location: z.string().optional(),
  purpose: z.string().optional(),
});

// Chapter Schema
export const ChapterSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string().optional(),
  status: z.enum(['draft', 'review', 'final']).default('draft'),
  word_count: z.number().default(0),
  content: z.string().default(''),
  scenes: z.array(z.string()).default([]),
});

// Patch Schema for Staging
export const PatchSchema = z.object({
  id: z.string(),
  section: z.enum(['characters', 'locations', 'timeline', 'outline', 'chapters', 'style']),
  operation: z.enum(['create', 'update', 'delete']),
  path: z.string(),
  timestamp: z.string(),
  data: z.any(),
});

// Snapshot Schema
export const SnapshotSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  version: z.string(),
  description: z.string(),
  data: z.any(),
});

// Main Project Schema
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  
  // Style Engine
  style_doctrine: StyleDoctrineSchema,
  style_profiles: z.array(StyleProfileSchema).default([]),
  
  // Canon
  characters: z.array(CharacterSchema).default([]),
  locations: z.array(LocationSchema).default([]),
  timeline: z.array(TimelineEventSchema).default([]),
  outline_template: OutlineTemplateSchema.optional(),
  scenes: z.array(SceneSchema).default([]),
  chapters: z.array(ChapterSchema).default([]),
  
  // Workflow
  staged_patches: z.array(PatchSchema).default([]),
  snapshots: z.array(SnapshotSchema).default([]),
  
  // Feedback
  feedback_log: z.array(z.object({
    id: z.string(),
    timestamp: z.string(),
    type: z.enum(['style', 'continuity', 'structure']),
    message: z.string(),
    severity: z.enum(['info', 'warning', 'error']),
  })).default([]),
});

export type StyleDoctrine = z.infer<typeof StyleDoctrineSchema>;
export type StyleProfile = z.infer<typeof StyleProfileSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type OutlineBeat = z.infer<typeof OutlineBeatSchema>;
export type OutlineTemplate = z.infer<typeof OutlineTemplateSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Patch = z.infer<typeof PatchSchema>;
export type Snapshot = z.infer<typeof SnapshotSchema>;
export type Project = z.infer<typeof ProjectSchema>;
