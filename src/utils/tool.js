
import { isEmpty } from '@u/validate'

export function recursionRemoveNullChild (children) {
  const arr = []
  if (!children) {
    return
  }
  children.forEach(item => {
    if (isEmpty(item.children)) {
      delete item.children
    } else {
      item.children = recursionRemoveNullChild(item.children)
    }
    arr.push(item)
  })
  return arr
}

export function generateUUID () {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23]
  var uuid = s.join('')
  return uuid
}

// 删除对象中空的属性
export function deleteObjectEmptyAttr (obj) {
  Object.keys(obj).forEach((key) => {
    if (isEmpty(obj[key])) {
      delete obj[key]
    }
  })
  return obj
}

/**
 * keyArr新数组对象的属性集合 ['attr', {oldAttr: newAttr}]
 * arr原数组对象
 */
export function getAttrFromArray (keyArr, arr) {
  const newArr = []
  arr.forEach((e, index) => {
    keyArr.forEach(key => {
      if (!newArr[index]) newArr[index] = {}
      if (Object.prototype.toString.call(key) === '[object String]') {
        newArr[index][key] = e[key]
      } else {
        const oldKey = Object.keys(key)[0]
        const newKey = key[oldKey]
        newArr[index][newKey] = e[oldKey]
      }
    })
  })
  return newArr
}

// 节流
export function throttle (fn, wait, immediate) {
  let timer = null
  let callNow = immediate
  return function () {
    const context = this
    const args = arguments
    if (callNow) {
      fn.apply(context, args)
      callNow = false
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

// 按照字节长截取字符串
export function subStringWithStrlen (str, L) {
  var result = ''
  var strlen = str.length // 字符串长度
  var chrlen = str.replace(/[^x00-\xff]/g, '**').length // 字节长度

  if (chrlen <= L) { return str }

  for (var i = 0, j = 0; i < strlen; i++) {
    var chr = str.charAt(i)
    if (/[x00-\xff]/.test(chr)) {
      j++ // ascii码为0-255，一个字符就是一个字节的长度
    } else {
      j += 2 // ascii码为0-255以外，一个字符就是两个字节的长度
    }
    if (j <= L) { // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
      result += chr
    } else { // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
      return result + '...'
    }
  }
}

// 将网络图片变成 base64
export function getBase64Img (src, cb) {
  var image = new Image()
  image.src = src + '?v=' + Math.random() // 处理缓存
  image.crossOrigin = '*' // 支持跨域图片
  image.onload = function () {
    var base64 = setBase64Image(image)
    cb && cb(base64)
  }
}

export function setBase64Image (img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var dataURL = canvas.toDataURL('image/png') // 可选其他值 image/jpeg
  return dataURL
}

export function escapeUrl (targetPath) {
  const escapeMap = Object.freeze(new Map([
    ['%2B', '+'],
    ['%2F', '/'],
    ['%20', ' '],
    ['%3F', '?'],
    ['%25', '%'],
    ['%3D', '='],
    ['%23', '#'],
    ['%26', '&'],
    ['A1B2C3', '&']
  ]))
  const typeArr = [...escapeMap.keys()]
  typeArr.forEach(item => {
    const temType = escapeMap.get(item)
    const reg = new RegExp(`${item}`, 'g')
    if (targetPath && targetPath.includes(item)) {
      targetPath = targetPath.replace(reg, temType)
    }
  })
  return targetPath
}
