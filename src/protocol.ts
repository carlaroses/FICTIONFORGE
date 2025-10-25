import { z } from 'zod';

// Command Grammar Schemas
export const CommandSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('create_project'),
    title: z.string(),
  }),
  z.object({
    type: z.literal('style_add'),
    rules: z.string(),
  }),
  z.object({
    type: z.literal('device_ban'),
    device: z.string(),
  }),
  z.object({
    type: z.literal('lexicon_avoid'),
    word: z.string(),
  }),
  z.object({
    type: z.literal('add_character'),
    name: z.string(),
    properties: z.record(z.string()),
  }),
  z.object({
    type: z.literal('add_location'),
    name: z.string(),
    properties: z.record(z.string()),
  }),
  z.object({
    type: z.literal('use_outline'),
    template: z.string(),
  }),
  z.object({
    type: z.literal('generate_chapter'),
    number: z.number(),
  }),
  z.object({
    type: z.literal('commit'),
  }),
  z.object({
    type: z.literal('reject'),
  }),
]);

export type Command = z.infer<typeof CommandSchema>;

// Delta Schema for Staging
export const DeltaSchema = z.object({
  id: z.string(),
  command: CommandSchema,
  timestamp: z.string(),
  status: z.enum(['pending', 'staged', 'committed', 'rejected']).default('pending'),
});

export type Delta = z.infer<typeof DeltaSchema>;

// Command Parser
export class CommandParser {
  static parse(input: string): Command | null {
    const trimmed = input.trim();
    
    // Create project "Title"
    const createProjectMatch = trimmed.match(/^Create project "([^"]+)"$/i);
    if (createProjectMatch) {
      return {
        type: 'create_project',
        title: createProjectMatch[1],
      };
    }
    
    // STYLE+: <rules/text>
    const styleAddMatch = trimmed.match(/^STYLE\+:\s*(.+)$/i);
    if (styleAddMatch) {
      return {
        type: 'style_add',
        rules: styleAddMatch[1],
      };
    }
    
    // DEVICE-: <device>
    const deviceBanMatch = trimmed.match(/^DEVICE-:\s*(.+)$/i);
    if (deviceBanMatch) {
      return {
        type: 'device_ban',
        device: deviceBanMatch[1],
      };
    }
    
    // LEXICON-: <word>
    const lexiconAvoidMatch = trimmed.match(/^LEXICON-:\s*(.+)$/i);
    if (lexiconAvoidMatch) {
      return {
        type: 'lexicon_avoid',
        word: lexiconAvoidMatch[1],
      };
    }
    
    // Add character "Name": key=value, key=value
    const addCharacterMatch = trimmed.match(/^Add character "([^"]+)":\s*(.+)$/i);
    if (addCharacterMatch) {
      const properties: Record<string, string> = {};
      const propsStr = addCharacterMatch[2];
      const propPairs = propsStr.split(',').map(p => p.trim());
      
      for (const pair of propPairs) {
        const [key, value] = pair.split('=').map(s => s.trim());
        if (key && value) {
          properties[key] = value;
        }
      }
      
      return {
        type: 'add_character',
        name: addCharacterMatch[1],
        properties,
      };
    }
    
    // Add location "Name": key=value, key=value
    const addLocationMatch = trimmed.match(/^Add location "([^"]+)":\s*(.+)$/i);
    if (addLocationMatch) {
      const properties: Record<string, string> = {};
      const propsStr = addLocationMatch[2];
      const propPairs = propsStr.split(',').map(p => p.trim());
      
      for (const pair of propPairs) {
        const [key, value] = pair.split('=').map(s => s.trim());
        if (key && value) {
          properties[key] = value;
        }
      }
      
      return {
        type: 'add_location',
        name: addLocationMatch[1],
        properties,
      };
    }
    
    // Use outline "Template"
    const useOutlineMatch = trimmed.match(/^Use outline "([^"]+)"$/i);
    if (useOutlineMatch) {
      return {
        type: 'use_outline',
        template: useOutlineMatch[1],
      };
    }
    
    // Generate Chapter N
    const generateChapterMatch = trimmed.match(/^Generate Chapter (\d+)$/i);
    if (generateChapterMatch) {
      return {
        type: 'generate_chapter',
        number: parseInt(generateChapterMatch[1], 10),
      };
    }
    
    // Commit
    if (trimmed.toLowerCase() === 'commit') {
      return { type: 'commit' };
    }
    
    // Reject
    if (trimmed.toLowerCase() === 'reject') {
      return { type: 'reject' };
    }
    
    return null;
  }
}
