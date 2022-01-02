const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      let newGood = state.good
      const incrGood = {
        ...state,
        good: newGood += 1
      }
      return incrGood
    case 'OK':
      let newOk = state.ok
      const incrOk = {
        ...state,
        ok: newOk += 1
      }
      return incrOk
    case 'BAD':
      let newBad = state.bad
      const incrBad = {
        ...state,
        bad: newBad += 1
      }
      return incrBad
    case 'ZERO':
      return initialState
    default: return state
  }

}

export default counterReducer