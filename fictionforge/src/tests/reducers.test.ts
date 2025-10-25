import { describe, it, expect } from 'vitest';
import { ProjectReducer } from '../reducers.js';
import { CommandParser } from '../protocol.js';

describe('ProjectReducer', () => {
  it('should create a new project', () => {
    const project = ProjectReducer.createProject('Test Novel');
    
    expect(project.title).toBe('Test Novel');
    expect(project.characters).toEqual([]);
    expect(project.locations).toEqual([]);
    expect(project.chapters).toEqual([]);
    expect(project.staged_patches).toEqual([]);
    expect(project.style_doctrine.lexicon_prefer).toEqual([]);
    expect(project.style_doctrine.lexicon_avoid).toEqual([]);
    expect(project.style_doctrine.devices_ban).toEqual([]);
  });

  it('should add a character', () => {
    const project = ProjectReducer.createProject('Test Novel');
    const command = CommandParser.parse('Add character "John Doe": description=hero, traits=brave,arc=redemption');
    
    expect(command).not.toBeNull();
    if (command && command.type === 'add_character') {
      const delta = {
        id: '1',
        command,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const updatedProject = ProjectReducer.applyDelta(project, delta);
      expect(updatedProject.staged_patches).toHaveLength(1);
      expect(updatedProject.staged_patches[0].section).toBe('characters');
      expect(updatedProject.staged_patches[0].operation).toBe('create');
    }
  });

  it('should add a location', () => {
    const project = ProjectReducer.createProject('Test Novel');
    const command = CommandParser.parse('Add location "Forest": description=dark,type=exterior');
    
    expect(command).not.toBeNull();
    if (command && command.type === 'add_location') {
      const delta = {
        id: '1',
        command,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const updatedProject = ProjectReducer.applyDelta(project, delta);
      expect(updatedProject.staged_patches).toHaveLength(1);
      expect(updatedProject.staged_patches[0].section).toBe('locations');
      expect(updatedProject.staged_patches[0].operation).toBe('create');
    }
  });

  it('should ban a device', () => {
    const project = ProjectReducer.createProject('Test Novel');
    const command = CommandParser.parse('DEVICE-: rhetorical questions');
    
    expect(command).not.toBeNull();
    if (command && command.type === 'device_ban') {
      const delta = {
        id: '1',
        command,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const updatedProject = ProjectReducer.applyDelta(project, delta);
      expect(updatedProject.staged_patches).toHaveLength(1);
      expect(updatedProject.staged_patches[0].section).toBe('style');
      expect(updatedProject.staged_patches[0].operation).toBe('update');
    }
  });

  it('should commit patches', () => {
    const project = ProjectReducer.createProject('Test Novel');
    const command = CommandParser.parse('Add character "John Doe": description=hero');
    
    if (command && command.type === 'add_character') {
      const delta = {
        id: '1',
        command,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const projectWithPatches = ProjectReducer.applyDelta(project, delta);
      expect(projectWithPatches.staged_patches).toHaveLength(1);
      
      const committedProject = ProjectReducer.commitPatches(projectWithPatches);
      expect(committedProject.staged_patches).toHaveLength(0);
      expect(committedProject.characters).toHaveLength(1);
      expect(committedProject.snapshots).toHaveLength(1);
    }
  });

  it('should reject patches', () => {
    const project = ProjectReducer.createProject('Test Novel');
    const command = CommandParser.parse('Add character "John Doe": description=hero');
    
    if (command && command.type === 'add_character') {
      const delta = {
        id: '1',
        command,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const projectWithPatches = ProjectReducer.applyDelta(project, delta);
      expect(projectWithPatches.staged_patches).toHaveLength(1);
      
      const rejectedProject = ProjectReducer.rejectPatches(projectWithPatches);
      expect(rejectedProject.staged_patches).toHaveLength(0);
      expect(rejectedProject.characters).toHaveLength(0);
    }
  });
});
