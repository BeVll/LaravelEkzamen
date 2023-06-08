export interface IProductEdit {
    name: string,
    image: File,
    status: boolean
    description: string,
    priority: number,
    price: number,
    discountPrice?: number,
    category_id: number,
    imgChange: boolean
}
export interface ICategory {
    id: number,
    name: string,
    image: File,
    status: boolean,
    description: string
}
export interface ICategoryResponse{
    data: Array<ICategory>
}