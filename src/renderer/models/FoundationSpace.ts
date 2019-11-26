import BaseCard from './BaseCard'
import isAce from '../gameplay/rules/isAce'

export default class FoundationSpace extends BaseCard {
  public promoted: boolean = true

  public type: string = 'FoundationSpace'

  constructor () {
    super()

    this.rules.push(isAce)
  }
}
