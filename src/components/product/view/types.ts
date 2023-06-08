export interface IProduct {
    id: number,
    name: string,
    image: File,
    status: boolean
    description: string,
    priority: number,
    price: number,
    discountPrice?: number,
    category_id: number
}

export interface IProductResponse{
    data: Array<IProduct>,
    current_page: number,
    total: number,
    last_page: number
}

export interface IProductSearch {
    page?: number|string|null
}