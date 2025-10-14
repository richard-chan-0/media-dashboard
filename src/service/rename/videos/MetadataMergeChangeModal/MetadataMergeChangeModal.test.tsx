import { vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetadataMergeChangeModal from './MetadataMergeChangeModal';
import { renderWithProvider } from '../../../../lib/test/renameRenderer';

const mockDispatch = vi.fn();
const mockPageDispatch = vi.fn();
vi.mock('../../../../lib/hooks/usePageContext', () => ({
    useRename: () => ({
        state: {
            nameChanges: {
                changes: [
                    {
                        input: 'folder/oldname.txt',
                        output: 'folder/changedname.txt'
                    }
                ]
            }
        },
        dispatch: mockDispatch,
        pageDispatch: mockPageDispatch,
    }),
}));
vi.mock('../../../../lib/utilities', () => ({
    removePathFromFilePath: (name: string) => name.split('/').pop(),
    splitPathFromFilePath: (name: string) => ({ path: name.split('/').slice(0, -1).join('/'), name: name.split('/').pop() }),
}));
vi.mock('../../shared/Modal/Modal', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="modal">{children}</div>
}));
vi.mock('iconoir-react', () => ({
    XmarkSquareSolid: () => <svg data-testid="close-icon" />,
    Refresh: () => <svg data-testid="spinner-icon" />
}));
vi.mock('../../../../lib/theme', () => ({
    default: { buttonColor: 'bg-blue-500', buttonFormat: 'rounded' }
}));
vi.mock('../../../../lib/api/api', () => ({
    get: vi.fn().mockResolvedValue({
        audio: [
            { stream_number: 1, language: 'en', title: 'English Audio', merge_track_number: 101 },
            { stream_number: 2, language: 'es', title: 'Spanish Audio', merge_track_number: 102 }
        ],
        subtitle: [
            { stream_number: 3, language: 'en', title: 'English Subtitle', merge_track_number: 201 },
            { stream_number: 4, language: 'es', title: 'Spanish Subtitle', merge_track_number: 202 }
        ]
    })
}));
vi.mock('../../../../lib/constants', () => ({
    ffmpegLink: 'http://mock-ffmpeg-link',
    no_api_error: 'No API link configured'
}));

describe('MetadataMergeChangeModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onMerge: vi.fn(),
        currentName: 'oldname.txt'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders modal when open', () => {
        renderWithProvider(<MetadataMergeChangeModal {...defaultProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        renderWithProvider(<MetadataMergeChangeModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('close-icon').parentElement!);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('displays streams once loaded', async () => {
        renderWithProvider(<MetadataMergeChangeModal {...defaultProps} />);
        expect(await screen.findByText('Audio Order: [ ]')).toBeInTheDocument();
        expect(await screen.findByText('Subtitle Order: [ ]')).toBeInTheDocument();
    });

    it('updates selected audio streams correctly', async () => {
        renderWithProvider(<MetadataMergeChangeModal {...defaultProps} />);
        expect(await screen.findByText('Audio Order: [ ]')).toBeInTheDocument();
        const audioCheckbox = await screen.findByLabelText('en - English Audio');
        fireEvent.click(audioCheckbox);
        expect(screen.getByText('Audio Order: [ en - English Audio ]')).toBeInTheDocument();
    });

    it('updates selected subtitle streams correctly', async () => {
        renderWithProvider(<MetadataMergeChangeModal {...defaultProps} />);
        expect(await screen.findByText('Subtitle Order: [ ]')).toBeInTheDocument();
        const subtitleCheckbox = await screen.findByLabelText('en - English Subtitle');
        fireEvent.click(subtitleCheckbox);
        expect(screen.getByText('Subtitle Order: [ en - English Subtitle ]')).toBeInTheDocument();
    });

    it('calls onMerge with correct data on submit', async () => {
        renderWithProvider(<MetadataMergeChangeModal {...defaultProps} />);
        expect(await screen.findByTestId('spinner-icon')).not.toBeInTheDocument();
        const audioCheckbox = await screen.findByLabelText('en - English Audio');
        fireEvent.click(audioCheckbox);
        const subtitleCheckbox = await screen.findByLabelText('en - English Subtitle');
        fireEvent.click(subtitleCheckbox);
        fireEvent.click(screen.getByText('Update'));
        expect(defaultProps.onMerge).toHaveBeenCalledWith({
            filename: 'oldname.txt',
            output_filename: 'temp-oldname.txt',
            audio_tracks: '[101]',
            subtitle_tracks: '[201]'
        });
    });

    it('does not call onMerge if no streams are selected', async () => {
        renderWithProvider(<MetadataMergeChangeModal {...defaultProps} />);
        fireEvent.click(screen.getByText('Update'));
        expect(defaultProps.onMerge).not.toHaveBeenCalled();
    });
});