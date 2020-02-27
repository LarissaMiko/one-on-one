import {make_matches} from '../match.js'

describe('Match making', () => {
  it('test length for 2 persons', () => {
    expect(
      make_matches(["u1", "u2"], "event_id", "Mon Feb 17 2020 13:48:00 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Feb 17 2020 18:48:00 GMT+0100 (Mitteleuropäische Normalzeit)")
    ).toHaveLength(1)
  })
  it('test length for 3 persons', () => {
    expect(
      make_matches(["u1", "u2", "u3"], "event_id", "Mon Feb 17 2020 13:48:00 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Feb 17 2020 18:48:00 GMT+0100 (Mitteleuropäische Normalzeit)")
    ).toHaveLength(2)
  })
  it('test length for 4 persons', () => {
    expect(
      make_matches(["u1", "u2", "u3", "u4"], "event_id", "Mon Feb 17 2020 13:48:00 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Feb 17 2020 18:48:00 GMT+0100 (Mitteleuropäische Normalzeit)")
    ).toHaveLength(2)
  })
  it('array for u1 and u2', () => {
    expect(
      make_matches(["u1", "u2"], "event_id", "Mon Feb 17 2020 13:48:00 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Feb 17 2020 18:48:00 GMT+0100 (Mitteleuropäische Normalzeit)")
    ).toMatchObject([[['u1', 'u2']]])
  })
  it('array for u1, u2, u3', () => {
    expect(
      make_matches(["u1", "u2", "u3"], "event_id", "Mon Feb 17 2020 13:48:00 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Feb 17 2020 18:48:00 GMT+0100 (Mitteleuropäische Normalzeit)")
    ).toMatchObject([ [ [ 'u1', 'u3' ], [ 'u2', 0 ] ], [ [ 'u1', 0 ], [ 'u2', 'u3' ] ] ])
  })
  it('array for u1, u2, u3, u4', () => {
    expect(
      make_matches(["u1", "u2", "u3", "u4"], "event_id", "Mon Feb 17 2020 13:48:00 GMT+0100 (Mitteleuropäische Normalzeit)", "Mon Feb 17 2020 18:48:00 GMT+0100 (Mitteleuropäische Normalzeit)")
    ).toMatchObject([
      [ [ 'u1', 'u3' ], [ 'u2', 'u4' ] ],
      [ [ 'u1', 'u4' ], [ 'u2', 'u3' ] ]
    ])
  })
})
