import { Table, SeatingConflict, Guest } from '../types';

export const MOCK_TABLES: Table[] = [
  { id: 't1', name: 'Head Table', shape: 'head', capacity: 8, x: 300, y: 50 },
  { id: 't2', name: 'Table 1', shape: 'round', capacity: 8, x: 100, y: 250 },
  { id: 't3', name: 'Table 2', shape: 'round', capacity: 8, x: 300, y: 250 },
  { id: 't4', name: 'Table 3', shape: 'round', capacity: 8, x: 500, y: 250 },
  { id: 't5', name: 'Table 4', shape: 'rectangular', capacity: 10, x: 100, y: 450 },
  { id: 't6', name: 'Table 5', shape: 'rectangular', capacity: 10, x: 500, y: 450 },
];

export const MOCK_CONFLICTS: SeatingConflict[] = [
  { id: 'c1', guest1Id: '1', guest2Id: '3', reason: 'Political differences' }
];

// Helper to check if a table has a conflict
export const hasConflict = (tableGuests: Guest[], conflicts: SeatingConflict[]): boolean => {
  if (tableGuests.length < 2) return false;
  
  for (const conflict of conflicts) {
    const hasG1 = tableGuests.some(g => g.id === conflict.guest1Id);
    const hasG2 = tableGuests.some(g => g.id === conflict.guest2Id);
    if (hasG1 && hasG2) return true;
  }
  return false;
};

// Auto-assign logic
export const autoAssignGuests = (guests: Guest[], tables: Table[]): Guest[] => {
  const assignedGuests = [...guests];
  const unassigned = assignedGuests.filter(g => !g.tableId && g.rsvpStatus === 'attending');

  // Group by 'group' type
  const groups: Record<string, Guest[]> = {};
  unassigned.forEach(g => {
    if (!groups[g.group]) groups[g.group] = [];
    groups[g.group].push(g);
  });

  // Simple Greedy Algorithm: Fill tables with groups
  tables.forEach(table => {
    const currentCount = assignedGuests.filter(g => g.tableId === table.id).length;
    let spaceLeft = table.capacity - currentCount;
    if (spaceLeft <= 0) return;

    // Try to fit whole groups first
    for (const groupName in groups) {
      const group = groups[groupName];
      if (group.length > 0 && group.length <= spaceLeft) {
        // Assign whole group
        group.forEach(g => {
          const index = assignedGuests.findIndex(ag => ag.id === g.id);
          if (index !== -1) assignedGuests[index].tableId = table.id;
        });
        delete groups[groupName]; // Group assigned
        spaceLeft -= group.length;
      }
    }

    // Fill remaining space with individuals from larger groups
    for (const groupName in groups) {
        while (spaceLeft > 0 && groups[groupName].length > 0) {
            const g = groups[groupName].pop();
            if (g) {
                const index = assignedGuests.findIndex(ag => ag.id === g.id);
                if (index !== -1) assignedGuests[index].tableId = table.id;
                spaceLeft--;
            }
        }
    }
  });

  return assignedGuests;
};
