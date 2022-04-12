export function getColumnsNum({ current, pageSize }, index) {
  return (current - 1) * pageSize + index + 1
}

export function deepClone(item) {
  let copy
  if (item === null || typeof item !== 'object') {
    return item
  }
  // array
  if (item instanceof Array) {
    copy = []
    let len = item.length
    for (let i = 0; i < len; i++) {
      // 循环深克隆
      copy[i] = deepClone(item[i])
    }
    return copy
  }

  // object
  if (item instanceof Object) {
    copy = {}
    for (let val in item) {
      if (item.hasOwnProperty(val)) {
        copy[val] = deepClone(item[val])
      }
    }
    return copy
  }
  // date
  if (item instanceof Date) {
    copy = new Date()
    copy.setTime(item.getTime())
    return copy
  }
  throw new Error("Unable to copy item! Its type isn't supported.")
}
