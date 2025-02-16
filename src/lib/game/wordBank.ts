import { Difficulty } from './types';

export interface CompoundWord {
  word: string;
  firstSegment: string;
  secondSegment: string;
  difficulty: Difficulty;
  definition?: string;
}

// Sample compound words for testing
// In production, this would come from an API or database
const COMPOUND_WORDS: CompoundWord[] = [
  { word: 'sunshine', firstSegment: 'sun', secondSegment: 'shine', difficulty: 'easy', definition: 'Direct light from the sun' },
  { word: 'rainbow', firstSegment: 'rain', secondSegment: 'bow', difficulty: 'easy', definition: 'An arch of colors in the sky' },
  { word: 'starlight', firstSegment: 'star', secondSegment: 'light', difficulty: 'easy', definition: 'The light that comes from stars' },
  { word: 'moonbeam', firstSegment: 'moon', secondSegment: 'beam', difficulty: 'medium', definition: 'A ray of moonlight' },
  { word: 'snowflake', firstSegment: 'snow', secondSegment: 'flake', difficulty: 'medium', definition: 'A single crystal of snow' },
  { word: 'windmill', firstSegment: 'wind', secondSegment: 'mill', difficulty: 'medium', definition: 'A building with sails turned by wind' },
  { word: 'earthquake', firstSegment: 'earth', secondSegment: 'quake', difficulty: 'hard', definition: 'A sudden shaking of the ground' },
  { word: 'thunderstorm', firstSegment: 'thunder', secondSegment: 'storm', difficulty: 'hard', definition: 'A storm with thunder and lightning' },
  { word: 'wavelength', firstSegment: 'wave', secondSegment: 'length', difficulty: 'hard', definition: 'The distance between wave peaks' },
];

export class WordBankService {
  private words: CompoundWord[];

  constructor(words: CompoundWord[] = COMPOUND_WORDS) {
    this.words = words;
  }

  // Get a random word for the given difficulty
  getRandomWord(difficulty: Difficulty): CompoundWord {
    const difficultyWords = this.words.filter(word => word.difficulty === difficulty);
    if (difficultyWords.length === 0) {
      throw new Error(`No words available for difficulty: ${difficulty}`);
    }
    return difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
  }

  // Get today's word for daily challenge
  getDailyWord(date: Date = new Date()): CompoundWord {
    // Use the date to deterministically select a word
    const dateString = date.toISOString().split('T')[0];
    const dateHash = Array.from(dateString).reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
    return this.words[Math.abs(dateHash) % this.words.length];
  }

  // Validate a guess for the first segment
  validateFirstSegment(guess: string, targetSegment: string): boolean {
    return guess.toLowerCase() === targetSegment.toLowerCase();
  }

  // Validate a complete word guess
  validateWord(guess: string): boolean {
    return this.words.some(word => word.word.toLowerCase() === guess.toLowerCase());
  }

  // Get word definition
  getDefinition(word: string): string | undefined {
    return this.words.find(w => w.word.toLowerCase() === word.toLowerCase())?.definition;
  }

  // Check if a segment exists in any compound word
  isValidSegment(segment: string): boolean {
    return this.words.some(
      word => 
        word.firstSegment.toLowerCase() === segment.toLowerCase() ||
        word.secondSegment.toLowerCase() === segment.toLowerCase()
    );
  }

  // Get all words of a specific difficulty
  getWordsByDifficulty(difficulty: Difficulty): CompoundWord[] {
    return this.words.filter(word => word.difficulty === difficulty);
  }
} 