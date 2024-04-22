export const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString()
  return doc
}

export const formatNumber = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatCurrency = (x: number) => {
  if (x) return `${formatter.format(x)}`
  else return ''
}

export const formatDate = (dateParam: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateParam))
}

export const formatId = (x?: string) => {
  return `...${x?.substring(20, 24)}`
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

export const optimizeImage = (image: string, width: number) => {
  return image.replace('upload/', `upload/w_${width},q_auto:eco/`)
}
