export interface Properties {
    userId: number
    postedBy: string
    profileImage: string
    postId: number
    title: string
    propDescription: string
    developerName: string
    projectName: string
    countryName: string
    stateName: string
    cityName: string
    bedroomType: string
    bathroomType: string
    balconyType: string
    transactionType: string
    propertyAge: string
    propertySize: string
    propertyStatus: string
    constructionStatus: string
    price: number
    isBrokerAppVerified: boolean
    placeID: string
    placeName: string
    likes: number
    comments: number
    buyers: number
    userLiked: number
    raisedPostBuyerHand: number
    postMedias: PostMedia[]
  }

  export interface PostMedia {
    mediaBlobId: string
  }

  export interface AddDashboardPostRequest {
    postId: number
    displayOrder: number
    categoryId: number
    price?: number
    title?: string
    isBrokerAppVerified?: boolean
    fromDate?: string
    toDate?: string
    cityName: string
    stateName: string
    countryName: string
    placeName: string
    placeID: string
    searchText?: string
    marqueueText?: string
    geoLocationLatitude?: number
    geoLocationLongitude?: number
    viewportNorthEastLat?: number
    viewportNorthEastLng?: number
    viewportSouthWestLat?: number
    viewportSouthWestLng?: number
    isGlobal?: boolean
    email?: string,
    contactNo?: string,
    userId: number
    postMedias?: PostMedia[]
  }
  
  export interface ListDashboardPostRequest {
    categoryId?: number
    pageNo: number
    pageSize: number
    cityName: string
  }
  

  export interface DeleteDashboardPostRequest {
    categoryId?: number
    pageNo: number
    pageSize: number
    cityName: string
  }


  export interface SearchRequest {
    userId: number
    keyWord: string
    pageNumber: number
    pageSize: number
  }

  export interface Car {
    brokerAppVerified: string
    discount: string
    filters: Filters
    geoLocationLatitude: number
    geoLocationLongitude: number
    isNewCar: string
    keyWord: string
    kilometerDriven: string
    makeYear: string
    maxPrice: number
    minPrice: number
    pageNumber: number
    pageSize: number
    radius: number
    userId: number
  }

  export interface Generic {
    userId: number
    keyWord: string
    pageNumber: number
    pageSize: number
    brokerAppVerified: string
    placeID: string
    placeName: string
    geoLocationLatitude: number
    geoLocationLongitude: number
    radius: number
    filters: Filters
  }

  export interface Filters {
    tags: Tag[]
  }
  
  export interface Tag {
    name: string
    values: Value[]
  }
  
  export interface Value {
    key: string
    value: string
  }

  export interface IOption {
    id: number
    name: string
    endpoint: string
    isActive?: boolean
  }
  
  export interface ISelectedItem {
    id: number
    position: number
  }


  export interface PostData {
    postId: number
    heading: string
    description: string
    cityName: string,
    stateName: string,
    countryName: string,
    price?: number,
    isBrokerAppVerified?: boolean,
    title?: string,
    placeName: string,
    placeID: string,
    postMedias?: PostMedia[],
  }