export class MultiselectData {
    id: number;
    parentId: number;
    name: string;
    sortOrder: number;
}

export const multiselectData = [
    { id: 1, parentId: null, name: 'lvl-1, node 1', sortOrder: 1 },
    { id: 2, parentId: 1, name: 'lvl-2, node 1', sortOrder: 1 },
    { id: 3, parentId: 1, name: 'lvl-2, node 2', sortOrder: 2 },
    { id: 4, parentId: 1, name: 'lvl-2, node 3', sortOrder: 3 },
    { id: 5, parentId: null, name: 'lvl-1, node 2', sortOrder: 2 },
    { id: 6, parentId: 5, name: 'lvl-2, node 4', sortOrder: 1 },
    { id: 7, parentId: 5, name: 'lvl-2, node 5', sortOrder: 2 },
    { id: 8, parentId: 7, name: 'lvl-3, node 1', sortOrder: 1 },
    { id: 9, parentId: 7, name: 'lvl-3, node 2', sortOrder: 2 },
    { id: 10, parentId: null, name: 'lvl-1, node 3', sortOrder: 3 },
    { id: 11, parentId: null, name: 'lvl-1, node 4', sortOrder: 4 }
];

export const multiselectData2 = [
    { id: 1, parentId: null, name: 'lvl-1, node 1', sortOrder: 1 },
    { id: 5, parentId: null, name: 'lvl-1, node 2', sortOrder: 2 },
    { id: 10, parentId: null, name: 'lvl-1, node 3', sortOrder: 3 },
    { id: 11, parentId: null, name: 'lvl-1, node 4', sortOrder: 4 }
];