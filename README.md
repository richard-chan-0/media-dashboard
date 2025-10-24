# Media Utility Dashboard

A modern web interface for managing and transforming media files for your media server, built with React, TypeScript, and Vite. This dashboard interacts with the Media Utility API to help you rename, organize, and prepare video and comic files for use with Jellyfin and similar platforms.

## Features

- **Upload and Rename Media**: Upload video or comic files and rename them to Jellyfin-compatible formats.
- **Batch File Operations**: Preview, edit, and confirm batch renaming operations before applying changes.
- **Volume Management**: Organize comic chapters into volumes and re-zip them for easy import.
- **Stream Selection**: Set default audio and subtitle tracks for video files.
- **API Integration**: Communicates with the Media Utility API and Ffmpeg API for all backend operations.

## Architecture Overview

The application is built with a modular and scalable architecture:

- **React Context**: Used for state management, ensuring a clean separation of concerns and easy state sharing across components.
- **Component-Based Design**: The `src/lib/components` directory contains reusable UI components, while `src/service` encapsulates feature-specific logic.
- **API Layer**: The `src/lib/api` folder centralizes API calls, ensuring a single source of truth for backend communication.
- **Storybook**: Provides a visual testing environment for UI components.
- **Vitest**: Ensures robust unit testing with a focus on React components and hooks.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn if preferred)

### Installation

1. Install dependencies:

    ```sh
    pnpm install
    ```

2. Configure environment variables:
    - Set `VITE_MEDIA_UTILITY_API_LINK` in a `.env` file or via your environment to point to your Media Utility API instance.
    - (Optional) Set `VITE_FFMPEG_UTILITY_API_LINK` for ffmpeg-related features.

3. Start the development server:

    ```sh
    pnpm run dev
    ```

    The dashboard will be available at [http://localhost:5173](http://localhost:5173) by default.

## Usage

1. **Upload Files**: Drag and drop or select files to upload for renaming or volume creation.
2. **Preview Changes**: Review and edit proposed file name changes in the UI.
3. **Apply Changes**: Confirm to process renaming or volume creation via the API.
4. **Set Streams**: For videos, select default audio/subtitle tracks as needed.

## Development

- All source code is in the `src/` directory.
- Storybook stories are available for UI components. Run:

    ```sh
    pnpm run storybook
    ```

- Tests use [Vitest](https://vitest.dev/). Run:

    ```sh
    pnpm run test
    ```

## Deployment

### Docker Deployment

1. Build the Docker image:

    ```sh
    docker buildx build --platform linux/amd64 -t <account>/media-dashboard .
    ```

2. Push the image to a container registry:

    ```sh
    docker push <account>/media-dashboard:latest
    ```

3. Run the container:

    ```sh
    docker run -p 80:80 <account>/media-dashboard:latest
    ```

## Technologies

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/)
- [Vitest](https://vitest.dev/)
