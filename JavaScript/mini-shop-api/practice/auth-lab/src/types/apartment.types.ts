export type ApartmentRecord = {
    id: string;
    code: string;
    ownerAccountId: string | null;
};

export type ApartmentView = {
    id: string;
    code: string;
};

export type ApartmentListQuery = {
    page: number;
    pageSize: number;
};

export type ApartmentListResult = {
    data: ApartmentView[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
};
