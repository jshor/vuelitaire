import isBuildable from '@/gameplay/rules/isBuildable'
import ICard from '@/interfaces/ICard'
import IRule from '@/interfaces/IRule'
import generateId from 'uuid/v4'

export default abstract class BaseCard implements ICard {
  public id: string = generateId()

  public child: ICard = null

  public parent: ICard = null

  public promoted: boolean = false

  public revealed: boolean = true

  public animationIndex: number = 0

  public rank: number = -1

  public suit: string = null

  public hasError: boolean = false

  public rules: IRule[] = [isBuildable] // TODO: should be protected

  public canAcceptCard (card: ICard): boolean {
    return this.rules.reduce((result: boolean, rule: IRule): boolean => {
      return rule(this, card) && result
    }, true)
  }

  public toString () {
    return `${this.constructor.name}`
  }
}
