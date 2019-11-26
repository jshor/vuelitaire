import generateId from 'uuid/v4'
import ICard from '../types/interfaces/ICard'
import { isBuildable } from '../gameplay'
import IRule from '../gameplay/IRule'

export default class BaseCard implements ICard {
  public id: string = generateId()

  public child: ICard = null

  public promoted: boolean = false

  public isPlayed: boolean = true

  public revealed: boolean = true

  public animationIndex: number = 0

  public rank: number = -1

  public suit: string = null

  public type: string

  public rules: IRule[] = [isBuildable]

  public isPlayable (): boolean {
    return this.isPlayed && this.revealed
  }

  public canAcceptCard (card: ICard): boolean {
    return this.rules.reduce((result: boolean, rule: IRule): boolean => {
      return rule(this, card) && result
    }, true)
  }

  public toString () {
    return `${this.constructor.name}`
  }
}
