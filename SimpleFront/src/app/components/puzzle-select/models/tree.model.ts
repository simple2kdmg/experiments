import { ISortable } from './sortable.interface';

export class Tree<T extends ISortable> {
    nodes: TreeNode<T>[];

    constructor(data: T[], private valueField: string, private idField: string, private parentIdField: string) {
        this.nodes = this.createNodes(data);
    }

    private createNodes(data: T[], parentId: number = 0): TreeNode<T>[] {
        let nodes = data.sort( (el1, el2) => el1.sortOrder - el2.sortOrder ).map( elem => new TreeNode(elem, this.valueField) );
        nodes.forEach( node => node.children = nodes.filter( y => y.data[this.parentIdField] === node.data[this.idField] ) );
        return nodes.filter( node => node.data[this.parentIdField] === parentId );
    }
}

export class TreeNode<T> {
    name: string;
    data: T;
    children: TreeNode<T>[];

    constructor(elem: T, valueField: string) {
        this.name = elem[valueField];
        this.data = elem;
    }
}