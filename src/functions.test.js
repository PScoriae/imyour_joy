const {
    getCurrentTime,
    getRandInt,
    getAllDirFiles,
    refreshSpotifyAccessToken,
    getRandElem,
    sendRandSong,
    combineSongs,
    getSpotifyTracks,
    changeGuildIcon,
    initialiseClient,
  } = require('./functions')

// fixes output of random function
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
global.Math = mockMath

test('gets a random integer from the passed arg', () => {
    expect(getRandInt(10)).toBe(5)
})

test('refreshSpotifyAccessToken', () => {
  // mock response of first line
  // spy on function and see if response.body.access_token is what gets put as argument
})

test('returns a random element from an array', () => {
  const data = ['10', '20', '50', '80', '5', '27']
  const result = getRandElem(data)
  expect(result).toEqual('80')
})