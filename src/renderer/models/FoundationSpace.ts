import isAce from '../gameplay/rules/isAce'
import isBuildable from '../gameplay/rules/isBuildable'
import IRule from '../interfaces/IRule'
import BaseCard from './BaseCard'

export default class FoundationSpace extends BaseCard {
  public promoted: boolean = true

  public rules: IRule[] = [isBuildable, isAce]
}
