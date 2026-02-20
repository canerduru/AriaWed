import { AiInsight, View, BudgetCategory, GuestStats, Task } from '../types';
import { MOCK_TASKS } from './timelineService';
import { MOCK_GUESTS, calculateStats } from './guestService';
import { generateInitialBudget } from './budgetService';

// --- Context Aggregator ---
// Gathers data from various mock services to provide a snapshot for the AI

export const getAriaContext = (currentView: View) => {
  const budget = generateInitialBudget(35000); // Mock total
  const guests = MOCK_GUESTS;
  const guestStats = calculateStats(guests);
  const tasks = MOCK_TASKS;
  
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
  const totalSpent = budget.reduce((acc, c) => acc + c.spent, 0);
  
  return {
    currentView,
    weddingDate: '2024-09-24', // Mock
    daysToGo: 142, // Mock
    guestCount: {
      total: guestStats.total,
      confirmed: guestStats.attending,
      pending: guestStats.pending
    },
    budget: {
      total: 35000,
      spent: totalSpent,
      remaining: 35000 - totalSpent
    },
    tasks: {
      pending: pendingTasks,
      overdue: overdueTasks,
      highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').map(t => t.title)
    }
  };
};

// --- Insight Generator ---
// Simulates "Smart Reminders" & "Anxiety Detection"

export const generateInsights = (): AiInsight[] => {
  const context = getAriaContext(View.DASHBOARD);
  const insights: AiInsight[] = [];

  // 1. Budget Anxiety / Risk
  if (context.budget.spent > context.budget.total * 0.9) {
    insights.push({
      id: 'ins-budget-1',
      type: 'budget',
      title: 'Budget Alert',
      message: `You've used 90% of your budget. I recommend reviewing your remaining allocations for "Flowers" and "Decor".`,
      priority: 'high',
      actionLabel: 'Review Budget',
      actionView: View.BUDGET,
      isDismissed: false
    });
  }

  // 2. Deadline Risk
  if (context.tasks.overdue > 0) {
    insights.push({
      id: 'ins-task-1',
      type: 'timeline',
      title: 'Overdue Tasks',
      message: `You have ${context.tasks.overdue} overdue tasks. Can I help you prioritize specific items like "${context.tasks.highPriority[0]}"?`,
      priority: 'high',
      actionLabel: 'Go to Timeline',
      actionView: View.TIMELINE,
      isDismissed: false
    });
  }

  // 3. Guest Management
  if (context.guestCount.pending > 50) {
    insights.push({
      id: 'ins-guest-1',
      type: 'decision',
      title: 'RSVP Follow-up',
      message: `You still have ${context.guestCount.pending} pending RSVPs. I can draft a polite reminder email for you.`,
      priority: 'medium',
      actionLabel: 'Manage Guests',
      actionView: View.GUESTS,
      isDismissed: false
    });
  }

  // 4. Anxiety Support (Mock Trigger: "Late Night Planning")
  // In real app, check timestamps. Here, we just inject it for demo.
  insights.push({
    id: 'ins-anxiety-1',
    type: 'anxiety',
    title: 'Take a Breather',
    message: "Wedding planning is a marathon, not a sprint. Remember to take breaks. Would you like a quick 1-minute breathing exercise?",
    priority: 'low',
    actionLabel: 'Start Breathing',
    actionView: View.DASHBOARD, // Or trigger modal
    isDismissed: false
  });

  return insights;
};

// --- Prompt Suggestions ---

export const getSuggestedPrompts = (view: View): string[] => {
  switch (view) {
    case View.BUDGET:
      return [
        "How can I save on flowers?",
        "Is 10% a good tip for catering?",
        "What are hidden costs I should know?",
        "Analyze my spending so far"
      ];
    case View.GUESTS:
      return [
        "Draft a polite RSVP reminder",
        "How do I handle a 'B-list' of guests?",
        "Etiquette for kids-free weddings",
        "Seating chart advice for divorced parents"
      ];
    case View.VENDORS:
      return [
        "What questions should I ask a photographer?",
        "Compare plated dinner vs buffet costs",
        "Review this vendor contract for red flags",
        "Finding LGBTQ+ friendly vendors"
      ];
    case View.TIMELINE:
      return [
        "Create a timeline for the morning of",
        "When should hair and makeup start?",
        "List of photos for the photographer",
        "What if it rains during the ceremony?"
      ];
    case View.WEDDING_DAY:
      return [
        "Emergency kit checklist",
        "How to handle a late vendor",
        "Speech tips for the Best Man",
        "Calm my nerves!"
      ];
    default:
      return [
        "What should I prioritize this week?",
        "Help me manage my stress",
        "Turkish wedding traditions",
        "Budget breakdown for 150 guests"
      ];
  }
};
