export class Favorite {
    id: number;
    photoId: number;
    userId: number;

    constructor(pId: number, uId: number) {
        this.photoId = pId;
        this.userId = uId;
    }
}
