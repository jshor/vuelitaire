import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Suits } from '@/constants'
import CardFront from '../CardFront.vue'

function mountCard(suit: string, rank: number) {
  return mount(CardFront, { props: { suit, rank } })
}

describe('CardFront snapshots', () => {
  it('renders ace of spades', () => {
    expect(mountCard(Suits.SPADES, 0).html()).toMatchSnapshot()
  })

  it('renders 7 of hearts', () => {
    expect(mountCard(Suits.HEARTS, 6).html()).toMatchSnapshot()
  })

  it('renders jack of clubs', () => {
    expect(mountCard(Suits.CLUBS, 10).html()).toMatchSnapshot()
  })

  it('renders queen of diamonds', () => {
    expect(mountCard(Suits.DIAMONDS, 11).html()).toMatchSnapshot()
  })

  it('renders king of hearts', () => {
    expect(mountCard(Suits.HEARTS, 12).html()).toMatchSnapshot()
  })
})

describe('color class', () => {
  it.each([
    [Suits.HEARTS, 'card-front--red'],
    [Suits.DIAMONDS, 'card-front--red'],
    [Suits.CLUBS, 'card-front--black'],
    [Suits.SPADES, 'card-front--black'],
  ])('%s → %s', (suit, expected) => {
    const wrapper = mountCard(suit, 0)
    expect(wrapper.find('.card-front').classes()).toContain(expected)
  })
})

describe('rank display', () => {
  it.each([
    [0, 'A'],
    [1, '2'],
    [9, '10'],
    [10, 'J'],
    [11, 'Q'],
    [12, 'K'],
  ])('rank %i displays "%s"', (rank, expected) => {
    const wrapper = mountCard(Suits.SPADES, rank)
    expect(wrapper.find('.card-front__rank').text()).toBe(expected)
  })
})

describe('suit icon', () => {
  it.each([
    [Suits.HEARTS, '♥'],
    [Suits.DIAMONDS, '♦'],
    [Suits.CLUBS, '♣'],
    [Suits.SPADES, '♠'],
  ])('%s → "%s"', (suit, icon) => {
    const wrapper = mountCard(suit, 0)
    expect(wrapper.find('.card-front__suit').text()).toBe(icon)
  })
})

describe('mobile section', () => {
  it('shows peasant icon for non-royal ranks', () => {
    const wrapper = mountCard(Suits.CLUBS, 5)
    expect(wrapper.find('.card-front__peasant').exists()).toBe(true)
    expect(wrapper.find('.card-front__royal').exists()).toBe(false)
  })

  it('shows royal div for jack (rank 10)', () => {
    const wrapper = mountCard(Suits.CLUBS, 10)
    expect(wrapper.find('.card-front__royal').exists()).toBe(true)
    expect(wrapper.find('.card-front__peasant').exists()).toBe(false)
  })

  it('shows royal div for queen (rank 11)', () => {
    const wrapper = mountCard(Suits.HEARTS, 11)
    expect(wrapper.find('.card-front__royal').exists()).toBe(true)
  })

  it('shows royal div for king (rank 12)', () => {
    const wrapper = mountCard(Suits.SPADES, 12)
    expect(wrapper.find('.card-front__royal').exists()).toBe(true)
  })

  it('royal class uses Math.max(rank, 11) — king gets suit-12', () => {
    const wrapper = mountCard(Suits.DIAMONDS, 12)
    expect(wrapper.find('.card-front__royal').classes()).toContain('card-front__royal--diamonds-12')
  })

  it('jack royal class uses rank 11 (Math.max(10, 11) = 11)', () => {
    const wrapper = mountCard(Suits.CLUBS, 10)
    expect(wrapper.find('.card-front__royal').classes()).toContain('card-front__royal--clubs-11')
  })
})

describe('desktop section', () => {
  it('desktop div carries correct suit-rank class', () => {
    const wrapper = mountCard(Suits.HEARTS, 6)
    expect(wrapper.find('.card-front__desktop').classes())
      .toContain('card-front__desktop--hearts-7')
  })

  it('desktop div uses rank + 1 for king (rank 12 → 13)', () => {
    const wrapper = mountCard(Suits.SPADES, 12)
    expect(wrapper.find('.card-front__desktop').classes())
      .toContain('card-front__desktop--spades-13')
  })
})
