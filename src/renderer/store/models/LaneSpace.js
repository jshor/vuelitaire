import BaseModel from './BaseModel'
import { isKing } from '../../gameplay'

export default class LaneSpace extends BaseModel {
  constructor () {
    super()

    this.rules.push(isKing)
    this.type = 'LaneSpace'
  }
}
