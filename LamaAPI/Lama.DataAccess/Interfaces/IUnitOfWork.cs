using Lama.DataAccess.Models;

namespace Lama.DataAccess.Interfaces
{
    interface IUnitOfWork
    {
        IRepository<Album> Album { get; }
        IRepository<Category> Category { get; }
        IRepository<Comment> Comment { get; }
        IRepository<Favorite> Favorite { get; }
        IRepository<Like> Like { get; }
        IRepository<Location> Location { get; }
        IRepository<Notification> Notification { get; }
        IRepository<Photo> Photo { get; }
        IRepository<PhotoAlbum> PhotoAlbum { get; }
        IRepository<PhotoState> PhotoState { get; }
        IRepository<SearchHistory> SearchHistory { get; }
        IRepository<SharedAlbum> SharedAlbum { get; }
        IRepository<SharedPhoto> SharedPhoto { get; }
        IRepository<User> User { get; }
        IRepository<Video> Video { get; }
        IRepository<VideoAlbum> VideoAlbum { get; }
    }
}
