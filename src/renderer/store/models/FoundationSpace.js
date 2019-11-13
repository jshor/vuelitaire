import BaseModel from './BaseModel'
import { isAce } from '../../gameplay'

export default class FoundationSpace extends BaseModel {
  constructor () {
    super()

    this.promoted = true
    this.rules.push(isAce)
    this.type = 'FoundationSpace'
  }
}
