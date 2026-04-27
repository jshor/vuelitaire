import { ICard } from "@/interfaces/ICard";

export function isAncestor (card: ICard, ancestorId: string): boolean {
  return card.id === ancestorId || (card.parent ? isAncestor(card.parent, ancestorId) : false)
}
