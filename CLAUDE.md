# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Media Utility Dashboard is a React/TypeScript web application for managing and transforming media files for media servers like Jellyfin. It interacts with two backend APIs:
- Media Utility API (VITE_MEDIA_UTILITY_API_LINK) - handles file renaming and organization
- Ffmpeg API (VITE_FFMPEG_UTILITY_API_LINK) - handles video stream manipulation

## Development Commands

```bash
# Install dependencies (pnpm only - enforced by preinstall hook)
pnpm install

# Development server (runs on all network interfaces with --host)
pnpm run dev

# Run all tests
pnpm test

# Run Storybook tests specifically
pnpm test:storybook

# Lint code
pnpm lint

# Auto-fix linting issues
pnpm lint-fix

# Format code with Prettier
pnpm prettier

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run Storybook (component development environment)
pnpm storybook

# Build Storybook
pnpm build-storybook
```

## Architecture

### State Management Pattern

The app uses React Context with reducers for state management, not Redux. There are two main context patterns:

1. **RenameContext** (src/service/rename/RenameContext.tsx)
   - Manages state for file renaming operations
   - Uses two reducers:
     - `renameReducer` (src/lib/reducers/renameReducer.ts) - tracks name changes and media type
     - `pageReducer` (src/lib/reducers/pageReducer.ts) - tracks errors and preview files
   - Accessed via `useRename()` hook (src/lib/hooks/usePageContext.ts)
   - Context type: `RenameContextType` with `state`, `dispatch`, `pageState`, `pageDispatch`

2. **ManageContext** (src/service/manage/ManageContext.tsx)
   - Manages state for volume/chapter organization
   - Similar dual-reducer pattern

### API Layer Structure

API calls are centralized in `src/lib/api/`:
- `api.ts` - Core utilities (`postForm`, `postJson`, `get`)
  - `postForm` - for file uploads with progress tracking via `uploadDispatcher`
  - `postJson` - for JSON payloads
  - `get` - for retrieving data
  - All return `{ error: string }` on failure
- `rename.ts` - Rename-specific endpoints
- `metadata.ts` - Metadata/stream manipulation endpoints
- `factory.ts` - Factory functions for API calls

API links are configured via environment variables and accessed through `src/lib/constants.ts`:
```typescript
export const mediaLink = window?.ENV?.MEDIA_UTILITY_API_LINK ||
                        import.meta.env.VITE_MEDIA_UTILITY_API_LINK;
export const ffmpegLink = window?.ENV?.FFMPEG_UTILITY_API_LINK ||
                         import.meta.env.VITE_FFMPEG_UTILITY_API_LINK;
```

### Component Organization

- **Reusable components**: `src/lib/components/` - generic UI elements
- **Feature components**: `src/service/[feature]/` - feature-specific logic
  - `src/service/rename/` - File renaming workflow
    - `stages/` - Multi-step workflow components (RenameUpload, NameChangePreview, SetStreams)
    - `shared/` - Shared rename components (NameChangeTable, RenamePanel, Modal)
    - `videos/` - Video-specific components (MetadataEditChangeModal, MetadataMergeChangeModal)
    - `comics/` - Comic-specific components
  - `src/service/manage/` - Volume management workflow

### Stage-Based Workflows

The rename feature uses a multi-stage pattern:
1. Upload files
2. Preview name changes
3. Edit metadata (videos) or set streams
4. Apply changes

Each stage is a separate component in `src/service/rename/stages/`. The active stage is determined by task type constants:
- `TASK_RENAME` - file renaming workflow
- `TASK_METADATA` - metadata editing workflow
- `TASK_EDIT` - edit metadata for individual files
- `TASK_MERGE` - merge tracks from multiple files

Media type constants:
- `VIDEOS` - video file operations
- `COMICS` - comic file operations

### Type System

All TypeScript types are defined in `src/lib/types.ts`. Key types:
- `NameChange` / `NameChanges` - file rename operations
- `Stream` / `Streams` - video stream information
- `MetadataEditChanges` / `MetadataMergeChanges` - metadata operations
- `RenameState` / `RenameAction` - reducer state/actions
- `PageState` / `PageAction` - page-level state/actions
- `RenameContextType` - context shape

### Testing

Tests use Vitest with React Testing Library:
- Import `@testing-library/jest-dom` for DOM matchers
- Use `renderWithProvider()` utility from `src/lib/test/renameRenderer.tsx` for components that need RenameContext
- Mock API calls extensively
- Storybook stories double as visual tests

Test files are co-located with components using `.test.tsx` extension.
Stories use `.stories.tsx` extension.

## Code Style Guidelines

### Documentation
- Always use JSDoc comments for functions

### Naming
- Clear and descriptive variable names
- Use TypeScript for type safety

### Components
- Functional components with hooks
- Context providers wrap page-level components (see `src/pages/Rename.tsx` wrapper pattern)

## Docker Deployment

Build for linux/amd64 platform:
```bash
docker buildx build --platform linux/amd64 -t <account>/media-dashboard .
docker push <account>/media-dashboard:latest
docker run -p 80:80 <account>/media-dashboard:latest
```

## Important Notes

- Package manager is locked to pnpm (enforced by preinstall hook)
- The app expects backend APIs to be available - configure via .env file
- Upload progress tracking is handled through reducer dispatch in `postForm`
- Error handling: API utilities return `{ error: string }` format
- Context must be accessed within Provider boundaries - use the wrapper pattern from src/pages/Rename.tsx
