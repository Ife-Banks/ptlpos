// ===========================================
// USER & AUTH TYPES
// ===========================================

export type UserRole = "ADMIN" | "MANAGER" | "SALES_REP" | "SUPER_ADMIN" | "SUPPORT_ADMIN" | "BILLING_ADMIN";

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  tenant?: {
    id: string;
    name: string;
  };
  branches?: Array<{
    id: string;
    name: string;
  }>;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
  tenant?: {
    id: string;
    name: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
  saleId?: string;
}

export interface RegisterData {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}

// ===========================================
// TENANT TYPES
// ===========================================

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  industry?: string;
  taxConfig?: TaxConfig;
}

export interface TaxConfig {
  vatInclusive: boolean;
  taxRate: number;
  taxId?: string;
  receiptTemplate?: "A4" | "80mm" | "40mm";
  brandColor?: string;
}

export interface ReceiptSettings {
  showBusinessName: boolean;
  showPhone: boolean;
  showAddress: boolean;
  showUnitPrice: boolean;
  customHeader?: string;
  customFooter?: string;
  showCustomerName: boolean;
  showCustomerPhone: boolean;
}

// ===========================================
// PRODUCT TYPES
// ===========================================

export type ProductType = "SIMPLE" | "VARIANT" | "COMPOSITE";

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  type: ProductType;
  price: number;
  cost?: number;
  taxRate: number;
  imageUrl?: string;
  category?: string;
  variants?: ProductVariant[];
  compositeParent?: CompositeItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  attributes: Record<string, string>;
}

export interface CompositeItem {
  childProductId: string;
  quantity: number;
  childProduct?: Product;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  type?: ProductType;
  page?: number;
  limit?: number;
}

// ===========================================
// INVENTORY TYPES
// ===========================================

export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  branchId: string;
  branch?: Branch;
  quantity: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  branchId: string;
  quantity: number;
  type: "ADJUSTMENT" | "SALE" | "PURCHASE" | "TRANSFER" | "STOCKTAKE" | "PRODUCTION";
  note?: string;
  userId: string;
  createdAt: string;
}

export interface StockTransfer {
  id: string;
  fromBranchId: string;
  toBranchId: string;
  items: TransferItem[];
  status: "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface TransferItem {
  productId: string;
  quantity: number;
}

export interface Stocktake {
  id: string;
  name: string;
  branchId: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "APPLIED";
  counts: StocktakeCount[];
  createdAt: string;
}

export interface StocktakeCount {
  productId: string;
  countedQuantity: number;
  systemQuantity: number;
  variance: number;
}

// ===========================================
// SALES TYPES
// ===========================================

export type SaleStatus = "ACTIVE" | "HELD" | "COMPLETED" | "CANCELLED" | "REFUNDED";

export interface Sale {
  id: string;
  saleNumber: string;
  tenantId: string;
  branchId: string;
  customerId?: string;
  customer?: Customer;
  userId: string;
  user?: User;
  status: SaleStatus;
  items: SaleItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface CreateSaleItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface CompleteSaleRequest {
  paymentMethod: "CASH" | "CARD" | "OTHER";
  paidAmount: number;
}

// ===========================================
// PAYMENT TYPES
// ===========================================

export type PaymentMethod = "CASH" | "CARD" | "OTHER";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  saleId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  reference?: string;
  createdAt: string;
}

export interface PaymentBreakdown {
  method: PaymentMethod;
  amount: number;
}

// ===========================================
// CUSTOMER TYPES
// ===========================================

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  search?: string;
  page?: number;
  limit?: number;
}

// ===========================================
// SUPPLIER TYPES
// ===========================================

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// ORDER TYPES
// ===========================================

export type OrderStatus = "PENDING" | "PARTIAL" | "FULFILLED" | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: string;
  tenantId: string;
  branchId: string;
  customerId?: string;
  customer?: Customer;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  fulfilledQuantity: number;
  total: number;
}

// ===========================================
// PURCHASE ORDER TYPES
// ===========================================

export type POStatus = "DRAFT" | "SENT" | "PARTIAL" | "RECEIVED" | "CANCELLED";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  tenantId: string;
  supplierId: string;
  supplier?: Supplier;
  branchId: string;
  status: POStatus;
  items: POItem[];
  subtotal: number;
  total: number;
  expectedDate?: string;
  receivedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface POItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  total: number;
}

// ===========================================
// BRANCH TYPES
// ===========================================

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault: boolean;
  createdAt: string;
}

// ===========================================
// PRODUCTION TYPES
// ===========================================

export interface Recipe {
  id: string;
  tenantId: string;
  productId: string;
  product?: Product;
  inputs: RecipeInput[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeInput {
  id: string;
  recipeId: string;
  rawMaterialId: string;
  rawMaterial?: Product;
  quantity: number;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  productId: string;
  product?: Product;
  quantity: number;
  materialsUsed: ProductionMaterial[];
  totalCost: number;
  status: "RUNNING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface ProductionMaterial {
  rawMaterialId: string;
  rawMaterial?: Product;
  quantityUsed: number;
  cost: number;
}

// ===========================================
// ANALYTICS TYPES
// ===========================================

export interface DashboardAnalytics {
  revenue: number;
  revenueChange: number;
  salesCount: number;
  salesCountChange: number;
  customersCount: number;
  customersCountChange: number;
  inventoryValue: number;
  topProducts: TopProduct[];
  salesTrend: SalesTrendData[];
  staffPerformance: StaffPerformance[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface SalesTrendData {
  date: string;
  revenue: number;
  salesCount: number;
}

export interface StaffPerformance {
  userId: string;
  userName: string;
  salesCount: number;
  totalRevenue: number;
}

// ===========================================
// PAGINATION TYPES
// ===========================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ===========================================
// API ERROR TYPES
// ===========================================

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}