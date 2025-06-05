import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NameChangeModal from './NameChangeModal';

// Mock dependencies
const mockDispatch = vi.fn();
vi.mock('../../../pages/hooks/useRename', () => ({
    useRename: () => ({
        state: {
            nameChanges: {
                changes: [
                    { output: 'folder/oldname.txt' }
                ]
            }
        },
        dispatch: mockDispatch,
    }),
}));
vi.mock('../../utilities', () => ({
    removePathFromFilePath: (name: string) => name.split('/').pop(),
    splitPathFromFilePath: (name: string) => ({ path: name.split('/').slice(0, -1).join('/'), name: name.split('/').pop() }),
}));
vi.mock('../Modal/Modal', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="modal">{children}</div>
}));
vi.mock('iconoir-react', () => ({
    XmarkSquareSolid: () => <svg data-testid="close-icon" />
}));
vi.mock('../../theme', () => ({
    default: { buttonColor: 'bg-blue-500', buttonFormat: 'rounded' }
}));

describe('NameChangeModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        initialName: 'folder/oldname.txt',
    };

    it('renders modal when open', () => {
        render(<NameChangeModal {...defaultProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByLabelText(/Name:/)).toBeInTheDocument();
        expect(screen.getByDisplayValue('oldname.txt')).toBeInTheDocument();
    });

    it('does not render modal when closed', () => {
        render(<NameChangeModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<NameChangeModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('close-icon').parentElement!);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('updates input value when typed', () => {
        render(<NameChangeModal {...defaultProps} />);
        const input = screen.getByLabelText(/Name:/);
        fireEvent.change(input, { target: { value: 'newname.txt' } });
        expect((input as HTMLInputElement).value).toBe('newname.txt');
    });
    it('calls dispatch and onClose when Update is clicked', () => {
        mockDispatch.mockClear();
        render(<NameChangeModal {...defaultProps} />);
        const input = screen.getByLabelText(/Name:/);
        fireEvent.change(input, { target: { value: 'newname.txt' } });
        fireEvent.click(screen.getByText('Update'));
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_NAME_CHANGES' }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});