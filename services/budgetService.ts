import { BudgetCategory, VendorPayment, BudgetAlert, ScenarioResult } from '../types';

// Turkish Market Averages (Percentages)
const MARKET_AVERAGES: Record<string, { min: number, max: number }> = {
  'Venue (Mekan)': { min: 0.15, max: 0.30 },
  'Catering (Yemek)': { min: 0.25, max: 0.35 },
  'Photo & Video': { min: 0.10, max: 0.15 },
  'Flowers & Decor': { min: 0.08, max: 0.12 },
  'Music/DJ': { min: 0.05, max: 0.08 },
  'Attire (Gelinlik/Damatlık)': { min: 0.08, max: 0.10 },
  'Stationery (Davetiye)': { min: 0.02, max: 0.04 },
  'Transport (Ulaşım)': { min: 0.02, max: 0.03 },
  'Other/Emergency': { min: 0.05, max: 0.10 },
};

export const generateInitialBudget = (totalBudget: number): BudgetCategory[] => {
  return Object.keys(MARKET_AVERAGES).map((key, index) => {
    const avgPercent = (MARKET_AVERAGES[key].min + MARKET_AVERAGES[key].max) / 2;
    return {
      id: `cat-${index}`,
      name: key,
      allocated: Math.round(totalBudget * avgPercent),
      spent: 0,
      notes: `${(avgPercent * 100).toFixed(1)}% of budget based on market avg.`
    };
  });
};

export const checkBudgetHealth = (categories: BudgetCategory[], totalBudget: number): BudgetAlert[] => {
  const alerts: BudgetAlert[] = [];
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  // Check Total Budget
  if (totalSpent > totalBudget) {
    alerts.push({
      id: 'alert-total',
      type: 'danger',
      message: `Total budget exceeded by $${(totalSpent - totalBudget).toLocaleString()}!`
    });
  } else if (totalSpent > totalBudget * 0.9) {
    alerts.push({
      id: 'alert-total-warn',
      type: 'warning',
      message: `You have used ${((totalSpent / totalBudget) * 100).toFixed(0)}% of your total budget.`
    });
  }

  // Check Categories
  categories.forEach(cat => {
    if (cat.spent > cat.allocated) {
      alerts.push({
        id: `alert-${cat.id}`,
        type: 'danger',
        message: `${cat.name} is over budget by $${(cat.spent - cat.allocated).toLocaleString()}.`
      });
    } else if (cat.spent > cat.allocated * 0.9) {
      alerts.push({
        id: `alert-${cat.id}`,
        type: 'warning',
        message: `${cat.name} has reached 90% of allocated funds.`
      });
    }
  });

  return alerts;
};

export const calculateTip = (amount: number, type: 'standard' | 'excellent' = 'standard'): number => {
  // 10% standard, 20% excellent
  return Math.round(amount * (type === 'standard' ? 0.10 : 0.20));
};

export const runScenario = (
  currentGuestCount: number,
  newGuestCount: number,
  categories: BudgetCategory[]
): ScenarioResult[] => {
  // Categories affected by guest count: Catering, Stationery, Favors (assuming strictly proportional for this engine)
  const variableCategories = ['Catering (Yemek)', 'Stationery (Davetiye)'];
  
  return categories
    .filter(cat => variableCategories.some(v => cat.name.includes(v)))
    .map(cat => {
      const costPerHead = cat.allocated / currentGuestCount;
      const projectedCost = Math.round(costPerHead * newGuestCount);
      return {
        category: cat.name,
        currentCost: cat.allocated,
        projectedCost: projectedCost,
        difference: projectedCost - cat.allocated
      };
    });
};

export const getHiddenCosts = (): string[] => {
  return [
    "Service Charges (18-20% on Catering)",
    "Vendor Meals (Photo, Video, DJ team)",
    "Alterations for Attire",
    "Postage for Invitations",
    "Overtime fees for Venue/DJ",
    "Taxes (KDV) if not included in quotes"
  ];
};

export const MOCK_PAYMENTS: VendorPayment[] = [
  { id: 'p1', vendorName: 'Royal Garden Venue', category: 'Venue', amount: 5000, dueDate: '2024-05-01', status: 'paid', type: 'deposit' },
  { id: 'p2', vendorName: 'Golden Spoon Catering', category: 'Catering', amount: 3000, dueDate: '2024-06-15', status: 'pending', type: 'deposit' },
  { id: 'p3', vendorName: 'Dreamy Lens', category: 'Photo', amount: 1500, dueDate: '2024-06-20', status: 'pending', type: 'deposit' },
  { id: 'p4', vendorName: 'Royal Garden Venue', category: 'Venue', amount: 7000, dueDate: '2024-09-01', status: 'pending', type: 'final' },
];