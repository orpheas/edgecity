# Media Literacy Challenge

An interactive web application that teaches media manipulation literacy through a game-like experience. Users identify different types of media manipulation techniques in a social media-style feed, earning points and streaks while learning about digital literacy.

## Features

- Interactive social media-style feed with pre-crafted posts
- Multiple manipulation techniques to identify:
  - Misleading Context
  - Manipulated Media
  - False Connection
  - Fabricated Content
- Score tracking with streak multipliers
- Hint system with score penalties
- Progress tracking and game summary
- Fully client-side with localStorage persistence
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd media-literacy-challenge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start playing.

## Technology Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Context API
- Framer Motion
- React Hot Toast

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── context/         # React Context providers
│   ├── data/           # JSON data files
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
│   ├── images/        # Image files
│   └── videos/        # Video files
└── README.md
```

## Contributing

Feel free to submit issues and enhancement requests!
