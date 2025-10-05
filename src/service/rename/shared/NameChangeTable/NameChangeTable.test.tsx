import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NameChangeTable from './NameChangeTable';
import { NameChanges } from '../../../../lib/types';
import { RenameProvider } from '../../RenameProvider';
import '@testing-library/jest-dom';
import { VIDEOS } from '../../../../lib/constants';


describe('NameChangeTable', () => {
    const mockNameChanges: NameChanges = {
        changes: [
            { input: 'File1', output: 'NewFile1' },
            { input: 'File2', output: 'NewFile2' },
        ],
    };

    const mockOnEdit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the table with name changes', () => {
        render(
            <RenameProvider>
                <NameChangeTable
                    nameChanges={mockNameChanges}
                    onEdit={mockOnEdit}
                />
            </RenameProvider>
        );

        expect(screen.getByText('File1')).toBeInTheDocument();
        expect(screen.getByText('NewFile1')).toBeInTheDocument();
        expect(screen.getByText('File2')).toBeInTheDocument();
        expect(screen.getByText('NewFile2')).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked and update metadata', () => {
        render(
            <RenameProvider>
                <NameChangeTable
                    mediaType={VIDEOS}
                    nameChanges={mockNameChanges}
                    onEdit={mockOnEdit}
                />
            </RenameProvider>
        );


        const editButton = screen.getAllByTitle('Edit')[0];
        fireEvent.click(editButton);

        const updateButton = screen.getByText('Update');
        fireEvent.click(updateButton);

        expect(mockOnEdit).toHaveBeenCalledWith('File1', expect.anything(), false);
    });
});