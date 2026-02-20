import { Task, WeddingDayEvent } from '../types';

// Helper to add days to a date string
const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Helper to subtract months from a date string
const subMonths = (dateStr: string, months: number): string => {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
};

export const MOCK_TASKS: Task[] = [
  // Completed / In Progress (Assuming wedding is in 4 months)
  {
    id: 't1', weddingId: 'w1', title: 'Determine Budget', category: 'Legal',
    priority: 'high', dueDate: '2023-12-01', assignedTo: 'both', status: 'completed',
    completedAt: '2023-12-05'
  },
  {
    id: 't2', weddingId: 'w1', title: 'Book Venue', category: 'Venue',
    priority: 'high', dueDate: '2024-01-15', assignedTo: 'both', status: 'completed',
    completedAt: '2024-01-20'
  },
  {
    id: 't3', weddingId: 'w1', title: 'Hire Wedding Planner', category: 'Vendors',
    priority: 'medium', dueDate: '2024-02-01', assignedTo: 'bride', status: 'completed',
    completedAt: '2024-02-01'
  },
  
  // Upcoming / Urgent
  {
    id: 't4', weddingId: 'w1', title: 'Finalize Guest List', category: 'Guests',
    priority: 'high', dueDate: '2024-05-20', assignedTo: 'both', status: 'in_progress'
  },
  {
    id: 't5', weddingId: 'w1', title: 'Book Photographer', category: 'Vendors',
    priority: 'high', dueDate: '2024-05-25', assignedTo: 'bride', status: 'not_started'
  },
  {
    id: 't6', weddingId: 'w1', title: 'Order Wedding Dress', category: 'Attire',
    priority: 'high', dueDate: '2024-06-01', assignedTo: 'bride', status: 'not_started'
  },
  {
    id: 't7', weddingId: 'w1', title: 'Book Catering Tasting', category: 'Venue',
    priority: 'medium', dueDate: '2024-06-10', assignedTo: 'both', status: 'not_started'
  },
  
  // Future
  {
    id: 't8', weddingId: 'w1', title: 'Send Invitations', category: 'Guests',
    priority: 'high', dueDate: '2024-07-01', assignedTo: 'both', status: 'not_started'
  },
  {
    id: 't9', weddingId: 'w1', title: 'Buy Wedding Bands', category: 'Attire',
    priority: 'medium', dueDate: '2024-08-01', assignedTo: 'groom', status: 'not_started'
  },
  {
    id: 't10', weddingId: 'w1', title: 'Apply for Marriage License', category: 'Legal',
    priority: 'high', dueDate: '2024-08-15', assignedTo: 'both', status: 'not_started'
  }
];

export const MOCK_DAY_SCHEDULE: WeddingDayEvent[] = [
  { id: 'e1', weddingId: 'w1', time: '08:00', title: 'Bride Hair & Makeup', location: 'Hotel Suite', involvedParties: ['Bride', 'MUA', 'Photographer'] },
  { id: 'e2', weddingId: 'w1', time: '10:00', title: 'Groom Getting Ready', location: 'Groom Suite', involvedParties: ['Groom', 'Groomsmen'] },
  { id: 'e3', weddingId: 'w1', time: '11:30', title: 'First Look Photos', location: 'Hotel Garden', involvedParties: ['Bride', 'Groom', 'Photographer'] },
  { id: 'e4', weddingId: 'w1', time: '14:00', title: 'Transport to Venue', location: 'Lobby', involvedParties: ['Wedding Party'] },
  { id: 'e5', weddingId: 'w1', time: '15:30', title: 'Ceremony Begins', location: 'Main Lawn', involvedParties: ['All Guests', 'Officiant'] },
  { id: 'e6', weddingId: 'w1', time: '16:15', title: 'Cocktail Hour', location: 'Terrace', involvedParties: ['Guests'] },
  { id: 'e7', weddingId: 'w1', time: '17:30', title: 'Reception Entrance', location: 'Ballroom', involvedParties: ['Bride', 'Groom', 'DJ'] },
  { id: 'e8', weddingId: 'w1', time: '19:00', title: 'Dinner Service', location: 'Ballroom', involvedParties: ['Catering'] },
];

export const calculateProgress = (tasks: Task[]) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
};

export const getCategoryProgress = (tasks: Task[]) => {
  const categories = Array.from(new Set(tasks.map(t => t.category)));
  return categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    return {
      category: cat,
      total: catTasks.length,
      completed: catTasks.filter(t => t.status === 'completed').length,
      percentage: Math.round((catTasks.filter(t => t.status === 'completed').length / catTasks.length) * 100)
    };
  });
};

export const generateAutomatedTasks = (weddingDate: string): Task[] => {
  // In a real app, this would generate tasks relative to the wedding date
  // For now, we return mock tasks adjusted roughly
  return MOCK_TASKS;
};
