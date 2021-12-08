
export function getWeekOfYear (date) {
  var today = date
  var firstDay = new Date(today.getFullYear(), 0, 1)
  var dayOfWeek = firstDay.getDay()
  var spendDay = 1
  if (dayOfWeek !== 0) {
    spendDay = 7 - dayOfWeek + 1
  }
  firstDay = new Date(today.getFullYear(), 0, 1 + spendDay)
  var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000)
  var result = Math.ceil(d / 7)
  return result + 1
}

export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]

    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

export function dateFormatForMinutes (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    var year = d.getFullYear()
    var month = ('0' + (d.getMonth() + 1)).slice(-2)
    var sdate = ('0' + d.getDate()).slice(-2)
    return year + '-' + month + '-' + sdate
  }
}

// elementui日期时间范围 快捷选项
export const pickerOptionsRange = {
  shortcuts: [
    {
      text: '今天',
      onClick (picker) {
        const end = new Date()
        const start = new Date(new Date().toDateString())
        start.setTime(start.getTime())
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一周',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三个月',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}

// elementui月份范围 快捷选项
export const pickerOptionsRangeMonth = {
  shortcuts: [
    {
      text: '今年至今',
      onClick (picker) {
        const end = new Date()
        const start = new Date(new Date().getFullYear(), 0)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近半年',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - 6)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一年',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - 12)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}
