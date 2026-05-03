import { Card } from "@/types/Card";

export function isAncestor (card: Card, ancestorId: string): boolean {
  return card.id === ancestorId || (card.parent ? isAncestor(card.parent, ancestorId) : false)
}
