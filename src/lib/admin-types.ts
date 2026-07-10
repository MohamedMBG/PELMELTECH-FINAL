export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  price: number | null;
  quoteOnly: boolean;
  stockStatus: "in-stock" | "out-of-stock";
  newArrival: boolean;
  featured: boolean;
  status: "published" | "draft";
  type: "machine" | "material" | "consumable" | "accessory" | "service";
  specifications: {
    printWidth?: string;
    printSpeed?: string;
    resolution?: string;
    inkType?: string;
    materialCompatibility?: string;
    usageType?: string;
  };
  ctaLabel: "Request Quote" | "View Details" | "Contact Sales";
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: string | null;
  sortOrder: number;
  status: "published" | "hidden";
  createdAt: string;
  updatedAt: string;
}

export const ALL_PERMISSIONS = ["products", "categories", "quotes", "users"] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: "superadmin" | "member";
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  message: string;
  status: "new" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}

export interface DevisItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

/** A quotation/sale created by an admin with custom pricing. */
export interface Devis {
  id: string;
  number: string;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  items: DevisItem[];
  buyItems: DevisItem[]; // purchases/costs, priced manually, no tax
  taxRate: number; // percent, e.g. 20
  notes: string;
  status: "draft" | "sent" | "accepted";
  createdById: string; // admin who set the prices
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}
