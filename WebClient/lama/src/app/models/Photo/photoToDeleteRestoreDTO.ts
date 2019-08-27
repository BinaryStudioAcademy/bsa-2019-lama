// use this to send to server
// which photo should be delted or restored
export class PhotoToDeleteRestoreDTO {
    id: number;

    constructor(receivedId: number) {
      this.id = receivedId;
    }
}
