import { Component, OnInit, Input } from '@angular/core';
import { CommentListDto, User, CreateCommentDTO } from 'src/app/models';
import { UserService, AuthService, CommentService, FileService } from 'src/app/services';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.sass']
})
export class CommentsListComponent implements OnInit
{
  // properties
  @Input()
  public photoId: number;
  @Input()
  public photoAuthorId: number;

  public commentList: CommentListDto[];

  public newCommentText: string;

  public loggedUser: User;

  // fields
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private commentService: CommentService,
    private fileService: FileService
  ) { }

  ngOnInit()
  {
    const userId = this.authService.getLoggedUserId();

    if (userId)
    {
      this.userService.getUser(userId)
        .subscribe(user => this.loggedUser = user);
    }

    this.getComments();
  }

  private getComments()
  {
    this.commentService.getComments(this.photoId)
      .subscribe(
        comments => { 
          this.commentList = comments;
          this.commentList.forEach(c => {
            this.fileService.getPhoto(c.authorAvatar64Url).subscribe(url => c.authorAvatar64Url = url);
          })
        },
        err => this.commentList = []);
  }

  // methods
  public createCommentHandler(): void
  {
    if (!this.newCommentText.length) return;

    const commentToCreate: CreateCommentDTO =
    {
      photoId: this.photoId,
      userId: this.loggedUser.id,
      text: this.newCommentText
    };

    this.commentService.create(commentToCreate)
      .subscribe(commentId =>
        {
          this.newCommentText = '';

          const commentToShow: CommentListDto =
          {
            commentId,
            authorId: commentToCreate.userId,
            authorAvatar64Id: this.loggedUser.photoUrl,
            authorFirstName: this.loggedUser.firstName,
            authorLastName: this.loggedUser.lastName,
            commentText: commentToCreate.text
          };
          this.fileService.getPhoto(commentToShow.authorAvatar64Id).subscribe(url => {
            commentToShow.authorAvatar64Url = url;
            this.commentList.push(commentToShow);
          })
        });
  }
  public deleteCommentHandler(commentId: number): void
  {
    this.commentService.delete(commentId)
      .subscribe(r => this.commentList = this.commentList.filter(c => c.commentId !== commentId));
  }
  public isDeleteBtnShown(comment: CommentListDto): boolean
  {
    // you can delete all your comments
    // or all comments on your photo
    return this.loggedUser &&
            comment.commentId &&
            (comment.authorId === this.loggedUser.id ||
            this.photoAuthorId === this.loggedUser.id)
  }

}
