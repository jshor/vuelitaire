import BaseCard from './BaseCard'
import isBuildable from '../gameplay/rules/isBuildable'
import isKing from '../gameplay/rules/isKing'
import IRule from '../interfaces/IRule'

export default class LaneSpace extends BaseCard {
  public rules: IRule[] = [isBuildable, isKing]
}
