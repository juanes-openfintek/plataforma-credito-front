import FileType from 'file-type/browser'

/**
 * Function that checks the internal bytes of file to avoid false extensions
 * @param file File to check
 * @param allowedFormats List of formats allowed to check
 */
const checkFileFormat = (file: any, allowedFormats: string[]) => {
  let result = '-'
  return FileType.fromBlob(file)
    .then((res: any) => {
      if (res?.mime) {
        result = res?.mime
      }
      if (allowedFormats.some((format) => format === result)) {
        return true
      }
      return false
    })
    .catch(() => {
      return false
    })
}

export default checkFileFormat
