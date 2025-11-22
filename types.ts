
export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  OPERATIONS = 'OPERATIONS',
  PENDING_ORDERS = 'PENDING_ORDERS',
  STOCK = 'STOCK',
  MOVE_HISTORY = 'MOVE_HISTORY',
  SETTINGS = 'SETTINGS'
}

export type OperationStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Cancelled';
export type OperationType = 'Receipt' | 'Delivery' | 'Internal';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  avatarUrl?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  available: number; // free to use
  reorderPoint: number;
  unitPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface Operation {
  id: string;
  reference: string; // WH/IN/0001
  contact: string; // Vendor or Customer
  scheduleDate: string;
  sourceDocument?: string;
  status: OperationStatus;
  type: OperationType;
  lines: OperationLine[];
}

export interface OperationLine {
  id: string;
  productId: string;
  productName: string;
  demand: number;
  done: number;
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  trend?: number; // percentage
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: 'box' | 'alert' | 'truck' | 'dollar';
  isLowStock?: boolean;
}

export interface StockHistory {
  name: string;
  stock: number;
}

export interface MoveHistoryItem {
  id: string;
  date: string;
  product: string;
  reference: string;
  contact: string;
  from: string;
  to: string;
  quantity: number;
  status: string;
  type: 'In' | 'Out' | 'Internal';
}