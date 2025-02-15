# Compound Word Game

A Wordle-style game where players guess compound words in stages. The game features daily challenges, endless mode, and a unique two-phase guessing system.

## Features

- Two-phase compound word guessing
- Multiple difficulty levels
- Daily challenges and endless mode
- Score tracking and leaderboards
- Hint system
- User accounts and progression
- Social sharing

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase
- **Deployment**: Vercel
- **State Management**: Zustand
- **Animations**: Framer Motion

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your Supabase credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Rules

1. Each puzzle is split into two phases:
   - First phase: Guess a short segment (2-4 letters)
   - Second phase: Complete the full compound word using revealed letters
2. Difficulty levels determine initial letter reveal:
   - Easy: 2 letters
   - Medium: 3 letters
   - Hard: 4 letters
3. All guesses must be valid words from our word bank
4. Score points based on:
   - Accuracy of guesses
   - Time taken
   - Streak maintenance
   - Hint usage (penalties apply)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
