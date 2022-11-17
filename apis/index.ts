import useHttp from '~/composables/useHttp'

export const getIndexInfo = () => {
  return useHttp.get('info')
}

export const getArticleList = (params) => {
  return useHttp.get('article', params)
}
