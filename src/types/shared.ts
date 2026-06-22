export interface BaseDataInterface<T> {
    data:T
}
export interface BaseMessageInterface {
    message:string
}
export interface BaseStatusInterface {
    status:boolean
}

export interface BaseCursorPaginationInterface {
    prevCursor:string|null
    nextCursor:string|null
    search:string|null
    limit:number
}