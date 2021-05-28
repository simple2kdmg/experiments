import { ISortable } from './sortable.interface';

export class DropdownNode<T extends ISortable> {
    data: T;
    parent: DropdownNode<T>;
    children: DropdownNode<T>[];
    selectable: boolean;
    selected: boolean;
    hidden: boolean;

    constructor(init?: Partial<DropdownNode<T>>) {
        Object.assign(this, init);
    }

}

export class Hierarchy<T extends ISortable> {
    nodes: DropdownNode<T>[];
    selectedNode: DropdownNode<T>;
    filter: string;

    private nodeRefs: DropdownNode<T>[];
    private searchPool: string[];
    private updateFilterTimer;

    constructor(data: T[], private idField: string, private valueField: string, private parentIdField: string,
                private onlyMaxNested: boolean, private parentId: number = null) {
        this.createNodes(data);
    }

    public updateAvailable(data: T[], callback: Function): void {
        this.createNodes(data);
        const selectedData = this.selectedNode ? this.nodeRefs.find(node => node.data[this.idField] === this.selectedNode.data[this.idField])?.data : null;
        callback(selectedData);
    }

    public updateSelected(nextSelected: T, onError: Function): void {
        if (this.selectedNode) {
            this.selectedNode.selected = false;
        }
        if (!nextSelected) {
            this.selectedNode = null;
            return;
        }
        const nextSelectedNode = this.nodeRefs.find(node => node.data[this.idField] === nextSelected[this.idField]);
        if (!nextSelectedNode) {
            const permittedValues = this.nodeRefs.map(node => `{id: ${node.data[this.idField]}, value: ${node.data[this.valueField]}}`).join(',\n');
            onError('Selected node is not permitted.');
            throw new Error(`Node ${JSON.stringify(nextSelected)} is not available.\nAvailable nodes: [${permittedValues}]`);
        }
        nextSelectedNode.selected = true;
        this.selectedNode = nextSelectedNode;
    }

    public updateFilter(next: string, callback: Function): void {
        this.filter = next;
        clearTimeout(this.updateFilterTimer);
        this.updateFilterTimer = setTimeout(() => {
            this.searchPool = next.trim().toLowerCase().split(' ');
            this.setNodeAppearance();
            callback();
        }, 500);
    }

    private resetFilter(): void {
        this.filter = '';
        this.searchPool = [''];
    }

    private createNodes(data: T[]): void {
        this.resetFilter();
        this.nodeRefs = data.sort( (el1, el2) => el1.sortOrder - el2.sortOrder ).map( elem => new DropdownNode({
            data: elem,
            selectable: true
        }));

        if (!this.parentIdField) {
            this.nodes = this.nodeRefs;
            return;
        }

        this.nodeRefs.forEach( node => {
            node.children = this.nodeRefs.reduce((res, curr) => {
                if (curr.data[this.parentIdField] === node.data[this.idField]) {
                    curr.parent = node;
                    res.push(curr);
                }
                return res;
            }, []);
        });

        this.setNodeAppearance();

        this.nodes = this.nodeRefs.filter( x => x.data[this.parentIdField] == this.parentId );
    }

    private setNodeAppearance(): void {
        // if no filter - mark all nodes as not hidden
        if (!this.searchPool[0]) {
            this.nodeRefs.forEach(node => {
                node.selectable = !(this.onlyMaxNested && node.children.length > 0);
                node.hidden = false;
            });
            return;
        }

        const matchNodes: DropdownNode<T>[] = [];

        // if filter not empty, mark all nodes that match search-case as not hidden,
        // and all other as hidden
        this.nodeRefs.forEach(node => {
            node.selectable = !(this.onlyMaxNested && node.children.length > 0);
            const nodeValue = (node.data[this.valueField] as string).toLowerCase();
            const match = this.searchPool.every(f => nodeValue.includes(f));
            if (match && node.selectable) {
                node.hidden = false;
                matchNodes.push(node);
                return;
            }
            node.hidden = true;
        });

        // then, for all not hidden nodes, mark whole parent-chain as not hidden
        matchNodes.forEach(node => {
            let parent = node.parent;
            while (parent) {
                parent.hidden = false;
                parent = parent.parent;
            }
        });
    }

}