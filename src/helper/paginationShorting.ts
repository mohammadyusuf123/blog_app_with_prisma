// help function for pagination and sorting

type options = {
    page?: number,
    pageSize?: number,
    sortBy?: string,
    sortOrder?: string
}
type result = {
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number,
    skip: number,
    limit: number
}
export const paginationSortingHelper = (options: options): result => {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    return { sortBy,
         sortOrder ,
        page,
        pageSize,
        skip,
        limit
    };
}
