# Voqua

> **AI-Powered UGC Video Platform** - Create stunning user-generated content videos with AI avatars and intelligent campaign management.

## Features

### AI Avatar System

- **Professional AI Avatars** - Choose from diverse, high-quality AI personas
- **Multiple Voice Options** - Confident, engaging, and professional voice styles
- **Customizable Styles** - Professional, casual, and creative presentation modes

### Video Generation

- **AI-Powered Creation** - Generate UGC videos with advanced AI technology
- **Real-time Processing** - Watch your videos come to life with live status updates
- **High-Quality Output** - Professional-grade video production

### Campaign Management

- **Smart Organization** - Organize videos into targeted campaigns
- **Performance Analytics** - Track views, engagement, and campaign metrics
- **Real-time Notifications** - Stay updated with instant status alerts

### Modern Dashboard

- **Clean Interface** - Intuitive, user-friendly design
- **Responsive Layout** - Works perfectly on all devices
- **Real-time Updates** - Live data synchronization

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **Backend**: Supabase (Database + Auth + Storage)
- **AI**: Fal.ai Integration
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Architecture

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/voqua.git
   cd voqua
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_FAL_API_KEY=your_fal_ai_key
   ```

4. **Database Setup**

   ```bash
   # Run migrations
   npx supabase db push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features

### Dashboard Pages

- **Content Management** - View and manage all generated videos
- **Creator Selection** - Choose from available AI avatars
- **Campaign Analytics** - Track performance and engagement
- **Real-time Notifications** - Stay updated with live alerts

### AI Integration

- **Fal.ai Integration** - Advanced AI video generation
- **Multiple Avatar Options** - Diverse AI personas
- **Voice Customization** - Various speaking styles

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

```
