import { Project, Character, Location, TimelineEvent } from '../schemas/project.js';

export interface ContinuityIssue {
  type: 'duplicate_name' | 'unknown_reference' | 'co_presence_conflict';
  severity: 'warning' | 'error';
  message: string;
  entities: string[];
}

export class ContinuityChecker {
  static checkProject(project: Project): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];

    // Check for duplicate character names
    issues.push(...this.checkDuplicateCharacterNames(project.characters));

    // Check for duplicate location names
    issues.push(...this.checkDuplicateLocationNames(project.locations));

    // Check for unknown references in timeline
    issues.push(...this.checkTimelineReferences(project));

    // Check for co-presence conflicts
    issues.push(...this.checkCoPresenceConflicts(project));

    return issues;
  }

  private static checkDuplicateCharacterNames(characters: Character[]): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const nameCounts = new Map<string, Character[]>();

    for (const character of characters) {
      const name = character.name.toLowerCase();
      if (!nameCounts.has(name)) {
        nameCounts.set(name, []);
      }
      nameCounts.get(name)!.push(character);
    }

    for (const [name, chars] of nameCounts) {
      if (chars.length > 1) {
        issues.push({
          type: 'duplicate_name',
          severity: 'error',
          message: `Duplicate character name: "${chars[0].name}"`,
          entities: chars.map(c => c.id),
        });
      }
    }

    return issues;
  }

  private static checkDuplicateLocationNames(locations: Location[]): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const nameCounts = new Map<string, Location[]>();

    for (const location of locations) {
      const name = location.name.toLowerCase();
      if (!nameCounts.has(name)) {
        nameCounts.set(name, []);
      }
      nameCounts.get(name)!.push(location);
    }

    for (const [name, locs] of nameCounts) {
      if (locs.length > 1) {
        issues.push({
          type: 'duplicate_name',
          severity: 'error',
          message: `Duplicate location name: "${locs[0].name}"`,
          entities: locs.map(l => l.id),
        });
      }
    }

    return issues;
  }

  private static checkTimelineReferences(project: Project): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const characterIds = new Set(project.characters.map(c => c.id));
    const locationIds = new Set(project.locations.map(l => l.id));

    for (const event of project.timeline) {
      // Check character references
      for (const charId of event.characters) {
        if (!characterIds.has(charId)) {
          issues.push({
            type: 'unknown_reference',
            severity: 'error',
            message: `Unknown character reference in timeline: ${charId}`,
            entities: [event.id],
          });
        }
      }

      // Check location reference
      if (event.location && !locationIds.has(event.location)) {
        issues.push({
          type: 'unknown_reference',
          severity: 'error',
          message: `Unknown location reference in timeline: ${event.location}`,
          entities: [event.id],
        });
      }
    }

    return issues;
  }

  private static checkCoPresenceConflicts(project: Project): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];

    // Group timeline events by timestamp
    const eventsByTime = new Map<string, TimelineEvent[]>();
    for (const event of project.timeline) {
      if (!eventsByTime.has(event.timestamp)) {
        eventsByTime.set(event.timestamp, []);
      }
      eventsByTime.get(event.timestamp)!.push(event);
    }

    // Check for co-presence conflicts
    for (const [timestamp, events] of eventsByTime) {
      const characterLocations = new Map<string, string>();

      for (const event of events) {
        for (const charId of event.characters) {
          if (event.location) {
            if (characterLocations.has(charId)) {
              const existingLocation = characterLocations.get(charId)!;
              if (existingLocation !== event.location) {
                const character = project.characters.find(c => c.id === charId);
                issues.push({
                  type: 'co_presence_conflict',
                  severity: 'warning',
                  message: `Character "${character?.name || charId}" appears in multiple locations at ${timestamp}`,
                  entities: [charId, existingLocation, event.location],
                });
              }
            } else {
              characterLocations.set(charId, event.location);
            }
          }
        }
      }
    }

    return issues;
  }
}
