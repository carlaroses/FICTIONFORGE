import { StyleDoctrine } from '../schemas/project';

export interface StyleAnalysisResult {
  score: number;
  violations: StyleViolation[];
  metrics: StyleMetrics;
}

export interface StyleViolation {
  type: 'near' | 'violation';
  rule: string;
  text: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
}

export interface StyleMetrics {
  avg_sentence_length: number;
  rhetorical_questions: number;
  filter_verbs: number;
  pov_consistency: number;
  tense_consistency: number;
}

export class StyleAnalyzer {
  static analyze(text: string, doctrine: StyleDoctrine): StyleAnalysisResult {
    const violations: StyleViolation[] = [];
    const metrics = this.calculateMetrics(text);

    // Check lexicon avoid
    for (const word of doctrine.lexicon_avoid) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        violations.push({
          type: 'violation',
          rule: `Avoid word: ${word}`,
          text: match[0],
          position: match.index,
          severity: 'medium',
        });
      }
    }

    // Check banned devices
    for (const device of doctrine.devices_ban) {
      const regex = new RegExp(device, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        violations.push({
          type: 'violation',
          rule: `Banned device: ${device}`,
          text: match[0],
          position: match.index,
          severity: 'high',
        });
      }
    }

    // Check cadence if specified
    if (doctrine.cadence?.avg_sentence_length) {
      const targetLength = doctrine.cadence.avg_sentence_length;
      const deviation = Math.abs(metrics.avg_sentence_length - targetLength);
      
      if (deviation > targetLength * 0.3) {
        violations.push({
          type: 'near',
          rule: `Sentence length deviation: ${deviation.toFixed(1)} words`,
          text: `Average: ${metrics.avg_sentence_length.toFixed(1)} words`,
          position: 0,
          severity: 'low',
        });
      }
    }

    // Check rhetorical questions
    if (metrics.rhetorical_questions > 3) {
      violations.push({
        type: 'near',
        rule: `Too many rhetorical questions: ${metrics.rhetorical_questions}`,
        text: 'Consider reducing rhetorical questions',
        position: 0,
        severity: 'low',
      });
    }

    // Check filter verbs
    if (metrics.filter_verbs > 5) {
      violations.push({
        type: 'near',
        rule: `Too many filter verbs: ${metrics.filter_verbs}`,
        text: 'Consider using direct action instead',
        position: 0,
        severity: 'low',
      });
    }

    // Calculate overall score
    const violationScore = violations.reduce((score, v) => {
      const multiplier = v.type === 'violation' ? 2 : 1;
      const severityMultiplier = v.severity === 'high' ? 3 : v.severity === 'medium' ? 2 : 1;
      return score + (multiplier * severityMultiplier);
    }, 0);

    const score = Math.max(0, 100 - violationScore);

    return {
      score,
      violations,
      metrics,
    };
  }

  private static calculateMetrics(text: string): StyleMetrics {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    const avg_sentence_length = sentences.length > 0 ? words.length / sentences.length : 0;
    
    // Count rhetorical questions
    const rhetorical_questions = (text.match(/\?/g) || []).length;
    
    // Count filter verbs (looked, saw, heard, felt, etc.)
    const filterVerbs = ['looked', 'saw', 'heard', 'felt', 'noticed', 'observed', 'realized'];
    const filter_verbs = filterVerbs.reduce((count, verb) => {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);

    // Simple POV consistency check (look for pronoun patterns)
    const firstPerson = (text.match(/\b(I|me|my|mine)\b/gi) || []).length;
    const secondPerson = (text.match(/\b(you|your|yours)\b/gi) || []).length;
    const thirdPerson = (text.match(/\b(he|she|him|her|his|hers|they|them|their)\b/gi) || []).length;
    
    const totalPronouns = firstPerson + secondPerson + thirdPerson;
    const pov_consistency = totalPronouns > 0 ? 
      Math.max(firstPerson, secondPerson, thirdPerson) / totalPronouns : 1;

    // Simple tense consistency check
    const pastTense = (text.match(/\b(was|were|had|did|went|came|said)\b/gi) || []).length;
    const presentTense = (text.match(/\b(is|are|has|does|goes|comes|says)\b/gi) || []).length;
    
    const totalTense = pastTense + presentTense;
    const tense_consistency = totalTense > 0 ? 
      Math.max(pastTense, presentTense) / totalTense : 1;

    return {
      avg_sentence_length,
      rhetorical_questions,
      filter_verbs,
      pov_consistency,
      tense_consistency,
    };
  }
}
