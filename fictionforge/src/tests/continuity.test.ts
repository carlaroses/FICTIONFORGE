import { describe, it, expect } from 'vitest';
import { ContinuityChecker } from '../analysis/continuity.js';
import { ProjectReducer } from '../reducers.js';
import { CommandParser } from '../protocol.js';

describe('ContinuityChecker', () => {
  it('should detect duplicate character names', () => {
    const project = ProjectReducer.createProject('Test Novel');
    
    // Add two characters with the same name
    const command1 = CommandParser.parse('Add character "John Doe": description=hero');
    const command2 = CommandParser.parse('Add character "John Doe": description=villain');
    
    if (command1 && command1.type === 'add_character' && command2 && command2.type === 'add_character') {
      const delta1 = {
        id: '1',
        command: command1,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const delta2 = {
        id: '2',
        command: command2,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      let updatedProject = ProjectReducer.applyDelta(project, delta1);
      updatedProject = ProjectReducer.applyDelta(updatedProject, delta2);
      updatedProject = ProjectReducer.commitPatches(updatedProject);
      
      const issues = ContinuityChecker.checkProject(updatedProject);
      const duplicateIssues = issues.filter(issue => issue.type === 'duplicate_name');
      
      expect(duplicateIssues).toHaveLength(1);
      expect(duplicateIssues[0].severity).toBe('error');
      expect(duplicateIssues[0].message).toContain('Duplicate character name');
    }
  });

  it('should detect duplicate location names', () => {
    const project = ProjectReducer.createProject('Test Novel');
    
    // Add two locations with the same name
    const command1 = CommandParser.parse('Add location "Forest": description=dark');
    const command2 = CommandParser.parse('Add location "Forest": description=bright');
    
    if (command1 && command1.type === 'add_location' && command2 && command2.type === 'add_location') {
      const delta1 = {
        id: '1',
        command: command1,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const delta2 = {
        id: '2',
        command: command2,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      let updatedProject = ProjectReducer.applyDelta(project, delta1);
      updatedProject = ProjectReducer.applyDelta(updatedProject, delta2);
      updatedProject = ProjectReducer.commitPatches(updatedProject);
      
      const issues = ContinuityChecker.checkProject(updatedProject);
      const duplicateIssues = issues.filter(issue => issue.type === 'duplicate_name');
      
      expect(duplicateIssues).toHaveLength(1);
      expect(duplicateIssues[0].severity).toBe('error');
      expect(duplicateIssues[0].message).toContain('Duplicate location name');
    }
  });

  it('should not find issues in a clean project', () => {
    const project = ProjectReducer.createProject('Test Novel');
    const issues = ContinuityChecker.checkProject(project);
    expect(issues).toHaveLength(0);
  });

  it('should handle projects with unique names correctly', () => {
    const project = ProjectReducer.createProject('Test Novel');
    
    const command1 = CommandParser.parse('Add character "John Doe": description=hero');
    const command2 = CommandParser.parse('Add character "Jane Smith": description=heroine');
    
    if (command1 && command1.type === 'add_character' && command2 && command2.type === 'add_character') {
      const delta1 = {
        id: '1',
        command: command1,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      const delta2 = {
        id: '2',
        command: command2,
        timestamp: new Date().toISOString(),
        status: 'staged' as const,
      };
      
      let updatedProject = ProjectReducer.applyDelta(project, delta1);
      updatedProject = ProjectReducer.applyDelta(updatedProject, delta2);
      updatedProject = ProjectReducer.commitPatches(updatedProject);
      
      const issues = ContinuityChecker.checkProject(updatedProject);
      const duplicateIssues = issues.filter(issue => issue.type === 'duplicate_name');
      
      expect(duplicateIssues).toHaveLength(0);
    }
  });
});
