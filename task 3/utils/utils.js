export const getRandomString = () => {
  const randomItems = new Uint32Array(28)
  crypto.getRandomValues(randomItems)
  const binaryStringItems = randomItems.map(
    (dec) => `0${dec.toString(16).substr(-2)}`
  )
  return binaryStringItems.reduce((acc, item) => `${acc}${item}`, '')
}
export const formatDate = (date = null, local = 'En-en') => {
  if (date) {
    return new Date(date).toLocaleString(local).split(',')[0]
  } else {
    return new Date().toLocaleString(local).split(',')[0]
  }
}
export const getCalendar = (value) => {
  const result = []
  switch (value) {
    case 'day':
      for (let day = 1; day <= 31; day++) {
        result.push(day)
      }
      return result
    case 'month':
      for (let month = 1; month <= 12; month++) {
        result.push(month)
      }
      return result
    case 'year':
      for (let year = 2000; year <= 2021; year++) {
        result.push(year)
      }
      return result
    default:
      return result
  }
}
export const unique = (arr, fieldName) => {
  const result = []
  arr.forEach((item) => {
    if (!result.find((res) => res[fieldName] === item[fieldName])) {
      result.push(item)
    }
  })
  return result
}
