import BaseCard from './BaseCard'
import isKing from '../gameplay/rules/isKing'

export default class LaneSpace extends BaseCard {
  public type: string = 'LaneSpace'

  constructor () {
    super()

    this.rules.push(isKing)
  }
}
