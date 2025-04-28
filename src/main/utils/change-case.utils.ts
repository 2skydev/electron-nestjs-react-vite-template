export const pascalToKebab = (input: string): string => {
  return (
    input
      // 소문자/숫자 뒤에 대문자가 오는 경우 하이픈 삽입 (예: someHTML -> some-HTML)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      // 대문자 뒤에 대문자와 소문자가 오는 경우 하이픈 삽입 (예: specialHTTPRequest -> special-HTTP-Request)
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      // 전체 문자열을 소문자로 변환
      .toLowerCase()
  )
}
