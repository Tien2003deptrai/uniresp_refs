import { MongoDBRepository } from '../repository/mongodb';
import { ArticleController } from './ArticleController';
import { UserController } from './UserController';
import { CommentController } from './CommentController';

export class AppController {
  public articles: ArticleController;
  public users: UserController;
  public comments: CommentController;

  constructor(repo: MongoDBRepository) {
    this.articles = new ArticleController(repo);
    this.users = new UserController(repo);
    this.comments = new CommentController(repo);
  }
}
