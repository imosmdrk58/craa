# Comic Reader App

A modern web application for reading and managing digital comics, built with Next.js, Prisma, and Supabase.

## Features

- User authentication and authorization
- Comic library management
- Reading progress tracking
- Multi-language support
- Responsive design
- Admin dashboard for content management

## Tech Stack

- **Frontend**: Next.js 13+ with App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase Storage
- **Authentication**: Custom auth with password hashing
- **Styling**: Tailwind CSS with Forms plugin

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key

4. Run database migrations:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/app`: Next.js 13+ app directory
  - `/api`: API routes
  - `/components`: Reusable React components
  - `/contexts`: React context providers
  - `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI Components from [Headless UI](https://headlessui.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
