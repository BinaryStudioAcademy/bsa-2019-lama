import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommentListDto, User, CreateCommentDTO } from 'src/app/models';
import { UserService, AuthService, CommentService } from 'src/app/services';
import { NotifierService } from 'angular-notifier';
import { FileService } from 'src/app/services/file.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.sass']
})
export class CommentsListComponent implements OnInit, OnDestroy {
  // properties
  @Input()
  public photoId: number;
  @Input()
  public photoAuthorId: number;

  public commentList: CommentListDto[];

  public newCommentText: string;

  public loggedUser: User;
  unsubscribe = new Subject();

  // fields
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private commentService: CommentService,
    private fileService: FileService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    const userId = this.authService.getLoggedUserId();

    if (userId) {
      this.userService
        .getUser(userId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          user => (this.loggedUser = user),
          error => this.notifier.notify('error', 'Error saving')
        );
    }

    this.getComments();
  }

  private getComments() {
    this.commentService
      .getComments(this.photoId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        comments => {
          this.commentList = comments;
          this.commentList.forEach(c => {
            if (
              c.authorAvatar64Id &&
              c.authorAvatar64Id.indexOf('base64') === -1
            ) {
              this.fileService
                .getPhoto(c.authorAvatar64Id)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(url => (c.authorAvatar64Url = url));
            } else if (c.authorAvatar64Id.indexOf('base64') !== -1) {
              c.authorAvatar64Url = c.authorAvatar64Id;
            } else {
              c.authorAvatar64Url = 'assets/default_avatar.png';
            }
          });
        },
        err => {
          this.commentList = [];
          this.notifier.notify('error', 'Error saving');
        }
      );
  }

  // methods
  createCommentHandler() {
    if (!this.newCommentText || !this.newCommentText.length) {
      return;
    }

    const commentToCreate: CreateCommentDTO = {
      photoId: this.photoId,
      userId: this.loggedUser.id,
      text: this.newCommentText
    };
    this.commentService
      .create(commentToCreate)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        commentId => {
          this.newCommentText = '';

          const commentToShow: CommentListDto = {
            commentId,
            authorId: commentToCreate.userId,
            authorAvatar64Id: this.loggedUser.photoUrl,
            authorFirstName: this.loggedUser.firstName,
            authorLastName: this.loggedUser.lastName,
            commentText: commentToCreate.text
          };
          if (commentToShow.authorAvatar64Id) {
            this.fileService
              .getPhoto(commentToShow.authorAvatar64Id)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(url => {
                commentToShow.authorAvatar64Url = url;
                this.commentList.push(commentToShow);
              });
          } else {
            commentToShow.authorAvatar64Url = 'assets/default_avatar.png';
            this.commentList.push(commentToShow);
          }
        },
        error => this.notifier.notify('error', 'Error creating comments')
      );
  }
  public deleteCommentHandler(commentId: number): void {
    this.commentService
      .delete(commentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        r => (
          (this.commentList = this.commentList.filter(
            c => c.commentId !== commentId
          )),
          error => this.notifier.notify('error', 'Error deleting comments')
        )
      );
  }
  public isDeleteBtnShown(comment: CommentListDto): boolean {
    // you can delete all your comments
    // or all comments on your photo
    return (
      this.loggedUser &&
      comment.commentId &&
      (comment.authorId === this.loggedUser.id ||
        this.photoAuthorId === this.loggedUser.id)
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
