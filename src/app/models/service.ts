export interface Service {

  service_id: number
  title: string
  description: string
  price: number
  isBasic: number
  img_url: string
  categories_category_id: number
  created_at?: Date
  updated_at?: Date

  type?: string
  id?: number
  serverId?: number
  serverName?: string
  serverRating?: number 
  serverImg?: string
  date?: string
  state?: string

}
