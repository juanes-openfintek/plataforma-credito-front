import { CreditData } from '../interfaces/creditData.interface'

/**
 * checkStatus is the function to check the status of an item
 * @param item is the item to be checked
 * @returns the item if the status is the same as the filter or the item if the filter is 'Filtrar'
 */
export const checkStatus = (item: any, filterSelection: string) => {
  if (filterSelection !== 'Filtrar' && filterSelection !== 'Ninguno') {
    if (item?.status === filterSelection) {
      return item
    }
  } else {
    return item
  }
}

/**
 * checkType is the function to check the type of an item
 * @param item is the item to be checked
 * @param filterName is the filter to be checked
 * @returns the item if the type is the same as the filter or the item if the filter is 'Filtrar'
 */
export const checkName = (item: any, filterName: string) => {
  if (!isNaN(Number(filterName))) {
    return item
  }
  if (filterName !== '') {
    const completeName = `${item?.name} ${item?.lastname}`
    if (completeName.toLowerCase().includes(filterName.toLowerCase())) {
      return item
    }
  } else {
    return item
  }
}

/**
 * checkType is the function to check the type of an item
 * @param item is the item to be checked
 * @param filterType is the filter to be checked
 * @returns the item if the type is the same as the filter or the item if the filter is 'Filtrar'
 */
export const checkRole = (item: any, filterSelection: string) => {
  if (filterSelection !== 'Filtrar') {
    if (item?.roles[0] === filterSelection) {
      return item
    }
  } else {
    return item
  }
}
/**
 * checkStartDate is the function to check the start date of an item
 * @param item is the item to be checked
 * @param filterStartDate is the filter to be checked
 * @returns the item if the start date is the same as the filter or the item if the filter is 'Filtrar'
 */
export const checkStartDate = (
  item: CreditData,
  filterStartDate: string
) => {
  if (filterStartDate !== '') {
    const creationDate = new Date(item?.created?.split('T')[0])
    const startDate = new Date(filterStartDate?.split('T')[0])
    if (creationDate >= startDate) {
      return item
    }
  } else {
    return item
  }
}
/**
 * checkEndDate is the function to check the end date of an item
 * @param item is the item to be checked
 * @param filterEndDate is the filter to be checked
 * @returns the item if the end date is the same as the filter or the item if the filter is 'Filtrar'
 */
export const checkEndDate = (item: CreditData, filterEndDate: string) => {
  if (filterEndDate !== '') {
    const creationDate = new Date(item?.created?.split('T')[0])
    const endDate = new Date(filterEndDate?.split('T')[0])
    if (creationDate <= endDate) {
      return item
    }
  } else {
    return item
  }
}

/**
 * checkID is the function to check the id of an item
 * @param item is the item to be checked
 * @param filterCode is the filter to be checked
 * @returns the item if the id is the same as the filter or the item if the filter is 'Filtrar'
 */
export const checkID = (item: any, filterCode: string) => {
  if (isNaN(Number(filterCode))) {
    return item
  }
  if (filterCode !== '') {
    if (item?.code.toString().includes(filterCode)) {
      return item
    }
  } else {
    return item
  }
}
