import useHttp from '~/composables/useHttp'

export const getIndexInfo = () => {
  return useHttp.get('info')
}

export const getArticleList = (params) => {
  return useHttp.get('article', params)
}
export const getArticleDetail = (id: string) => {
  return useHttp.get(`article/${id}`)
}

export const likeArticle = (id: string) => {
  return useHttp.put(`article_like/${id}`)
}
