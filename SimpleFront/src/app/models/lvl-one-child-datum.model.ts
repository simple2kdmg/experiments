export class LvlOneChildDatum {
    id: number;
    info: string;

    constructor(init?: Partial<LvlOneChildDatum>) {
        Object.assign(this, init);
    }

    public static getMockList(length: number): LvlOneChildDatum[] {
        let res = [];
        for (let i = 1; i <= length; i++) {
            const random = Math.round(Math.random() * 100);
            res.push(new LvlOneChildDatum({ id: random, info: `datum-${random}` }));
        }
        return res;
    }
}