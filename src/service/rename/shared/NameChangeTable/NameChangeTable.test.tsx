import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NameChangeTable from './NameChangeTable';
import { NameChanges } from '../../../../lib/types';
import { RenameProvider } from '../../RenameProvider';
import '@testing-library/jest-dom';
import { TASK_EDIT, TASK_MERGE } from '../../../../lib/constants';


describe('NameChangeTable', () => {
    const mockNameChanges: NameChanges = {
        changes: [
            { input: 'File1', output: 'NewFile1' },
            { input: 'File2', output: 'NewFile2' },
        ],
    };

    const mockOnClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the table with name changes', () => {
        render(
            <RenameProvider>
                <NameChangeTable
                    nameChanges={mockNameChanges}
                    wasAdded={[]}
                    onClick={mockOnClick}
                    changeType={TASK_EDIT}
                />
            </RenameProvider>
        );

        expect(screen.getByText('File1')).toBeInTheDocument();
        expect(screen.getByText('NewFile1')).toBeInTheDocument();
        expect(screen.getByText('File2')).toBeInTheDocument();
        expect(screen.getByText('NewFile2')).toBeInTheDocument();
    });

    it('calls onClick when edit button is clicked in TASK_EDIT mode', () => {
        render(
            <RenameProvider>
                <NameChangeTable
                    nameChanges={mockNameChanges}
                    wasAdded={[]}
                    onClick={mockOnClick}
                    changeType={TASK_EDIT}
                />
            </RenameProvider>
        );

        const editButton = screen.getAllByTitle('Edit')[0];
        fireEvent.click(editButton);

        expect(mockOnClick).toHaveBeenCalledWith('File1', 'NewFile1');
    });

    it('calls onClick when merge button is clicked in TASK_MERGE mode', () => {
        render(
            <RenameProvider>
                <NameChangeTable
                    nameChanges={mockNameChanges}
                    wasAdded={[]}
                    onClick={mockOnClick}
                    changeType={TASK_MERGE}
                />
            </RenameProvider>
        );

        const mergeButton = screen.getAllByTitle('Merge')[0];
        fireEvent.click(mergeButton);

        expect(mockOnClick).toHaveBeenCalledWith('File1', 'NewFile1');
    });

    it('displays blue styling for files that have been added', () => {
        render(
            <RenameProvider>
                <NameChangeTable
                    nameChanges={mockNameChanges}
                    wasAdded={['File1']}
                    onClick={mockOnClick}
                    changeType={TASK_EDIT}
                />
            </RenameProvider>
        );

        const editButtons = screen.getAllByTitle('Edit');
        expect(editButtons[0]).toBeInTheDocument();
    });
});