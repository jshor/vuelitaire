import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isKing } from '@/gameplay/rules/isKing'

export type { LaneSpace } from '@/types/LaneSpace'
import type { LaneSpace } from '@/types/LaneSpace'
import { createCard } from './Card'

export function createLaneSpace (): LaneSpace {
  return {
    ...createCard({
      revealed: true,
      rules: [isBuildable, isKing]
    }),
    type: 'LaneSpace'
  }
}
