
import { KPI, Product, StockHistory, Operation, MoveHistoryItem } from './types';

export const MOCK_USER = {
  id: 'u-1',
  name: 'Alex Sterling',
  email: 'alex@stockmaster.com',
  role: 'Manager' as const,
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const MOCK_KPIS: KPI[] = [
  { id: '1', label: 'Total Products', value: '1,234', trend: 12, trendDirection: 'up', icon: 'box' },
  { id: '2', label: 'Low Stock Items', value: '23', trend: 5, trendDirection: 'down', icon: 'alert', isLowStock: true },
  { id: '3', label: 'Pending Receipts', value: '4', icon: 'truck' },
  { id: '4', label: 'Total Valuation', value: '₹4,52,000', trend: 2.4, trendDirection: 'up', icon: 'dollar' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', sku: 'SM-1001', name: 'Wireless Noise-Canceling Headphones', category: 'Electronics', stockLevel: 142, available: 130, reorderPoint: 20, unitPrice: 299.00, status: 'In Stock', lastUpdated: '2023-10-25' },
  { id: '2', sku: 'SM-1002', name: 'Ergonomic Office Chair Pro', category: 'Furniture', stockLevel: 12, available: 10, reorderPoint: 15, unitPrice: 450.00, status: 'Low Stock', lastUpdated: '2023-10-24' },
  { id: '3', sku: 'SM-1003', name: 'Mechanical Keyboard RGB', category: 'Electronics', stockLevel: 85, available: 85, reorderPoint: 10, unitPrice: 129.50, status: 'In Stock', lastUpdated: '2023-10-26' },
  { id: '4', sku: 'SM-1004', name: 'USB-C Docking Station', category: 'Accessories', stockLevel: 0, available: 0, reorderPoint: 5, unitPrice: 89.99, status: 'Out of Stock', lastUpdated: '2023-10-20' },
  { id: '5', sku: 'SM-1005', name: '27-inch 4K Monitor', category: 'Electronics', stockLevel: 45, available: 43, reorderPoint: 10, unitPrice: 349.00, status: 'In Stock', lastUpdated: '2023-10-25' },
  { id: '6', sku: 'SM-1006', name: 'Standing Desk Frame', category: 'Furniture', stockLevel: 33, available: 33, reorderPoint: 8, unitPrice: 299.00, status: 'In Stock', lastUpdated: '2023-10-22' },
  { id: '7', sku: 'SM-1007', name: 'Laptop Stand Aluminum', category: 'Accessories', stockLevel: 210, available: 200, reorderPoint: 30, unitPrice: 45.00, status: 'In Stock', lastUpdated: '2023-10-26' },
];

export const MOCK_OPERATIONS: Operation[] = [
  {
    id: 'op-1',
    reference: 'WH/IN/0001',
    contact: 'Azure Interior',
    scheduleDate: '2023-10-27 10:00 AM',
    status: 'Ready',
    type: 'Receipt',
    lines: [
      { id: 'l-1', productId: '1', productName: 'Wireless Noise-Canceling Headphones', demand: 50, done: 0 },
      { id: 'l-2', productId: '3', productName: 'Mechanical Keyboard RGB', demand: 20, done: 0 }
    ]
  },
  {
    id: 'op-2',
    reference: 'WH/IN/0002',
    contact: 'Deco Addict',
    scheduleDate: '2023-10-28 02:30 PM',
    status: 'Waiting',
    type: 'Receipt',
    lines: [
      { id: 'l-3', productId: '6', productName: 'Standing Desk Frame', demand: 10, done: 0 }
    ]
  },
  {
    id: 'op-3',
    reference: 'WH/OUT/0001',
    contact: 'Gemini Solutions',
    scheduleDate: '2023-10-26 09:15 AM',
    status: 'Done',
    type: 'Delivery',
    lines: [
      { id: 'l-4', productId: '5', productName: '27-inch 4K Monitor', demand: 2, done: 2 }
    ]
  },
  {
    id: 'op-4',
    reference: 'WH/IN/0003',
    contact: 'Lumber Inc',
    scheduleDate: '2023-10-29 11:00 AM',
    status: 'Draft',
    type: 'Receipt',
    lines: []
  }
];

export const MOCK_MOVE_HISTORY: MoveHistoryItem[] = [
  { id: 'mh-1', date: '12/1/2023', product: 'Wireless Headphones', reference: 'WH/IN/0001', from: 'Vendor', to: 'WH/Stock1', quantity: 50, type: 'In', contact: 'Azure Interior', status: 'Ready' },
  { id: 'mh-2', date: '12/1/2023', product: '4K Monitor', reference: 'WH/OUT/0002', from: 'WH/Stock1', to: 'Vendor', quantity: 2, type: 'Out', contact: 'Azure Interior', status: 'Ready' },
  { id: 'mh-3', date: '12/1/2023', product: 'Office Chair', reference: 'WH/OUT/0002', from: 'WH/Stock2', to: 'Vendor', quantity: 1, type: 'Out', contact: 'Azure Interior', status: 'Ready' },
  { id: 'mh-4', date: '12/1/2023', product: 'Docking Station', reference: 'WH/INT/0005', from: 'Stock Zone A', to: 'Stock Zone B', quantity: 15, type: 'Internal', contact: 'Internal', status: 'Done' },
  { id: 'mh-5', date: '11/1/2023', product: 'Mechanical Keyboard', reference: 'WH/IN/0002', from: 'Vendor', to: 'Stock', quantity: 100, type: 'In', contact: 'Deco Addict', status: 'Done' },
];

export const MOCK_CHART_DATA: StockHistory[] = [
  { name: 'Mon', stock: 1180 },
  { name: 'Tue', stock: 1200 },
  { name: 'Wed', stock: 1150 },
  { name: 'Thu', stock: 1220 },
  { name: 'Fri', stock: 1234 },
  { name: 'Sat', stock: 1230 },
  { name: 'Sun', stock: 1234 },
];

// CSS Variables injection string - CLEAN MODERN THEME
export const GLOBAL_STYLES = `
  :root {
    /* Clean Modern Palette */
    --color-bg: 249 250 251;          /* #F9FAFB */
    --color-surface: 255 255 255;     /* #FFFFFF */
    --color-primary: 79 70 229;       /* #4F46E5 (Indigo 600) */
    --color-primary-600: 99 102 241;  /* #6366F1 (Indigo 500) */
    --color-primary-700: 67 56 202;   /* Darker Indigo */
    --color-accent: 16 185 129;       /* Emerald 500 */
    --color-danger: 239 68 68;        /* Red 500 */
    --color-warning: 245 158 11;      /* Amber 500 */
    --color-muted: 107 114 128;       /* Gray 500 */
    --color-text: 17 24 39;           /* #111827 */
    --color-border: 229 231 235;      /* Gray 200 */

    /* Typography */
    --font-family-sans: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
    --font-size-base: 16px;
    --line-height-base: 24px;

    /* Radii */
    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 20px;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

    /* Spacing scale (px) */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 24px;
    --space-6: 32px;
    --space-7: 40px;
    --space-8: 56px;
  }
  
  /* Dark Mode Support */
  .dark {
    --color-bg: 15 23 42;             /* Slate 900 */
    --color-surface: 30 41 59;        /* Slate 800 */
    --color-primary: 99 102 241;      /* Indigo 500 */
    --color-primary-600: 79 70 229;   /* Indigo 600 */
    --color-text: 248 250 252;        /* Slate 50 */
    --color-muted: 148 163 184;       /* Slate 400 */
    --color-border: 51 65 85;         /* Slate 700 */
    
    /* Adjust shadows for dark mode visibility */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }

  body {
    background-color: rgb(var(--color-bg));
    color: rgb(var(--color-text));
    font-family: var(--font-family-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgb(var(--color-bg));
  }
  ::-webkit-scrollbar-thumb {
    background: rgb(var(--color-border));
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--color-muted));
  }
`;
