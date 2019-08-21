export interface CommentListDto {
    commentId: number;

    authorId: number;
    authorAvatar64Id?: string;
    authorAvatar64Url?: string;
    authorFirstName?: string;
    authorLastName?: string;

    commentText: string;
}
