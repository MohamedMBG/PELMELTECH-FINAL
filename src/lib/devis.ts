import type { Devis, DevisItem } from "./admin-types";

export function lineAmount(item: DevisItem): number {
  return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
}

export function devisSubtotal(d: Pick<Devis, "items">): number {
  return d.items.reduce((sum, it) => sum + lineAmount(it), 0);
}

export function devisBuyTotal(d: Pick<Devis, "buyItems">): number {
  return (d.buyItems ?? []).reduce((sum, it) => sum + lineAmount(it), 0);
}

export function devisTax(d: Pick<Devis, "items" | "taxRate">): number {
  return devisSubtotal(d) * ((Number(d.taxRate) || 0) / 100);
}

export function devisTotal(d: Pick<Devis, "items" | "taxRate">): number {
  return devisSubtotal(d) + devisTax(d);
}
