import moment from 'moment'
export function timeFormat (row, column) {
  if (!row[column.property]) return '--'
  return moment(row[column.property]).format('YYYY-MM-DD HH:mm:ss')
}

export function dateFormat (row, column) {
  if (!row[column.property]) return '--'
  return moment(row[column.property]).format('YYYY-MM-DD')
}
