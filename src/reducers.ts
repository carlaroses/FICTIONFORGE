import { nanoid } from 'nanoid';
import { Project, Character, Location, TimelineEvent, Chapter, Patch, Snapshot, StyleDoctrine } from './schemas/project';
import { Command, Delta } from './protocol';

export class ProjectReducer {
  static createProject(title: string): Project {
    const now = new Date().toISOString();
    return {
      id: nanoid(),
      title,
      created_at: now,
      updated_at: now,
      style_doctrine: {
        lexicon_prefer: [],
        lexicon_avoid: [],
        devices_ban: [],
      },
      style_profiles: [],
      characters: [],
      locations: [],
      timeline: [],
      scenes: [],
      chapters: [],
      staged_patches: [],
      snapshots: [],
      feedback_log: [],
    };
  }

  static applyDelta(project: Project, delta: Delta): Project {
    const command = delta.command;
    const patches: Patch[] = [];

    switch (command.type) {
      case 'create_project':
        return this.createProject(command.title);

      case 'style_add':
        patches.push({
          id: nanoid(),
          section: 'style',
          operation: 'update',
          path: 'style_doctrine',
          timestamp: new Date().toISOString(),
          data: { rules: command.rules },
        });
        break;

      case 'device_ban':
        patches.push({
          id: nanoid(),
          section: 'style',
          operation: 'update',
          path: 'style_doctrine.devices_ban',
          timestamp: new Date().toISOString(),
          data: command.device,
        });
        break;

      case 'lexicon_avoid':
        patches.push({
          id: nanoid(),
          section: 'style',
          operation: 'update',
          path: 'style_doctrine.lexicon_avoid',
          timestamp: new Date().toISOString(),
          data: command.word,
        });
        break;

      case 'add_character':
        const character: Character = {
          id: nanoid(),
          name: command.name,
          description: command.properties.description || '',
          traits: command.properties.traits ? command.properties.traits.split(',').map(t => t.trim()) : [],
          relationships: {},
          arc: command.properties.arc || '',
        };
        patches.push({
          id: nanoid(),
          section: 'characters',
          operation: 'create',
          path: `characters.${character.id}`,
          timestamp: new Date().toISOString(),
          data: character,
        });
        break;

      case 'add_location':
        const location: Location = {
          id: nanoid(),
          name: command.name,
          description: command.properties.description || '',
          type: command.properties.type as any || 'other',
          atmosphere: command.properties.atmosphere || '',
        };
        patches.push({
          id: nanoid(),
          section: 'locations',
          operation: 'create',
          path: `locations.${location.id}`,
          timestamp: new Date().toISOString(),
          data: location,
        });
        break;

      case 'use_outline':
        // This would load a template - for now just create a placeholder
        patches.push({
          id: nanoid(),
          section: 'outline',
          operation: 'create',
          path: 'outline_template',
          timestamp: new Date().toISOString(),
          data: { template: command.template },
        });
        break;

      case 'generate_chapter':
        const chapter: Chapter = {
          id: nanoid(),
          number: command.number,
          title: `Chapter ${command.number}`,
          status: 'draft',
          word_count: 0,
          content: `[Placeholder content for Chapter ${command.number}]`,
          scenes: [],
        };
        patches.push({
          id: nanoid(),
          section: 'chapters',
          operation: 'create',
          path: `chapters.${chapter.id}`,
          timestamp: new Date().toISOString(),
          data: chapter,
        });
        break;

      case 'commit':
        return this.commitPatches(project);

      case 'reject':
        return this.rejectPatches(project);
    }

    // Add patches to staged_patches
    const updatedProject = {
      ...project,
      staged_patches: [...project.staged_patches, ...patches],
      updated_at: new Date().toISOString(),
    };

    return updatedProject;
  }

  static commitPatches(project: Project): Project {
    let updatedProject = { ...project };

    // Apply all staged patches
    for (const patch of project.staged_patches) {
      updatedProject = this.applyPatch(updatedProject, patch);
    }

    // Create snapshot
    const snapshot: Snapshot = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      version: `v${Date.now()}`,
      description: `Commit: ${project.staged_patches.length} patches`,
      data: updatedProject,
    };

    return {
      ...updatedProject,
      staged_patches: [],
      snapshots: [...updatedProject.snapshots, snapshot],
      updated_at: new Date().toISOString(),
    };
  }

  static rejectPatches(project: Project): Project {
    return {
      ...project,
      staged_patches: [],
      updated_at: new Date().toISOString(),
    };
  }

  private static applyPatch(project: Project, patch: Patch): Project {
    switch (patch.section) {
      case 'characters':
        if (patch.operation === 'create') {
          return {
            ...project,
            characters: [...project.characters, patch.data],
          };
        }
        break;

      case 'locations':
        if (patch.operation === 'create') {
          return {
            ...project,
            locations: [...project.locations, patch.data],
          };
        }
        break;

      case 'chapters':
        if (patch.operation === 'create') {
          return {
            ...project,
            chapters: [...project.chapters, patch.data],
          };
        }
        break;

      case 'style':
        if (patch.operation === 'update') {
          if (patch.path === 'style_doctrine.devices_ban') {
            return {
              ...project,
              style_doctrine: {
                ...project.style_doctrine,
                devices_ban: [...project.style_doctrine.devices_ban, patch.data],
              },
            };
          }
          if (patch.path === 'style_doctrine.lexicon_avoid') {
            return {
              ...project,
              style_doctrine: {
                ...project.style_doctrine,
                lexicon_avoid: [...project.style_doctrine.lexicon_avoid, patch.data],
              },
            };
          }
        }
        break;

      case 'outline':
        if (patch.operation === 'create') {
          return {
            ...project,
            outline_template: patch.data,
          };
        }
        break;
    }

    return project;
  }
}
