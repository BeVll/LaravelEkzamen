export interface ICategory {
    id: number,
    name: string,
    image: File,
    status: boolean
    description: string,

}

export interface ICategoryResponse{
    data: Array<ICategory>,
    current_page: number,
    total: number,
    last_page: number
}

export interface ICategorySearch {
    page?: number|string|null
}