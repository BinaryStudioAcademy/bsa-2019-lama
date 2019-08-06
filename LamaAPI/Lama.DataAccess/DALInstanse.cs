using System;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using Lama.DataAccess.Repositories;


namespace Lama.DataAccess
{
    public class DALInstanse : IUnitOfWork, IDisposable
    {
        private readonly ApplicationDbContext _db;
        private AlbumRepository _albumRepository;
        private CategoryRepository _categoryRepository;
        private CommentRepository _commentRepository;
        private FavoriteRepository _favoriteRepository;
        private LikeRepository _likeRepository;
        private LocationRepository _locationRepository;
        private NotificationRepository _notificationRepository;
        private PhotoAlbumRepository _photoAlbumRepository;
        private PhotoRepository _photoRepository;
        private PhotoStateRepository _photoStateRepository;
        private SearchHistoryRepository _searchHistoryRepository;
        private SharedAlbumRepository _sharedAlbumRepository;
        private SharedPhotoRepository _sharedPhotoRepository;
        private UserRepository _userRepository;
        private VideoAlbumRepository _videoAlbumRepository;
        private VideoRepository _videoRepository;
        private bool disposed = false;

        public DALInstanse(ApplicationDbContext context)
        {
            _db = context;
        }

        public IRepository<Album> Album
        {
            get
            {
                if (_albumRepository == null)
                    _albumRepository = new AlbumRepository(_db);
                return _albumRepository;
            }
        }

        public IRepository<Category> Category
        {
            get
            {
                if (_categoryRepository == null)
                    _categoryRepository = new CategoryRepository(_db);
                return _categoryRepository;
            }
        }

        public IRepository<Comment> Comment
        {
            get
            {
                if (_commentRepository == null)
                    _commentRepository = new CommentRepository(_db);
                return _commentRepository;
            }
        }

        public IRepository<Favorite> Favorite
        {
            get
            {
                if (_favoriteRepository == null)
                    _favoriteRepository = new FavoriteRepository(_db);
                return _favoriteRepository;
            }
        }

        public IRepository<Like> Like
        {
            get
            {
                if (_likeRepository == null)
                    _likeRepository = new LikeRepository(_db);
                return _likeRepository;
            }
        }

        public IRepository<Location> Location
        {
            get
            {
                if (_locationRepository == null)
                    _locationRepository = new LocationRepository(_db);
                return _locationRepository;
            }
        }

        public IRepository<Notification> Notification
        {
            get
            {
                if (_notificationRepository == null)
                    _notificationRepository = new NotificationRepository(_db);
                return _notificationRepository;
            }
        }

        public IRepository<Photo> Photo
        {
            get
            {
                if (_photoRepository == null)
                    _photoRepository = new PhotoRepository(_db);
                return _photoRepository;
            }
        }

        public IRepository<PhotoAlbum> PhotoAlbum
        {
            get
            {
                if (_photoAlbumRepository == null)
                    _photoAlbumRepository = new PhotoAlbumRepository(_db);
                return _photoAlbumRepository;
            }
        }

        public IRepository<PhotoState> PhotoState
        {
            get
            {
                if (_photoStateRepository == null)
                    _photoStateRepository = new PhotoStateRepository(_db);
                return _photoStateRepository;
            }
        }

        public IRepository<SearchHistory> SearchHistory
        {
            get
            {
                if (_searchHistoryRepository == null)
                    _searchHistoryRepository = new SearchHistoryRepository(_db);
                return _searchHistoryRepository;
            }
        }

        public IRepository<SharedAlbum> SharedAlbum
        {
            get
            {
                if (_sharedAlbumRepository == null)
                    _sharedAlbumRepository = new SharedAlbumRepository(_db);
                return _sharedAlbumRepository;
            }
        }

        public IRepository<SharedPhoto> SharedPhoto
        {
            get
            {
                if (_sharedPhotoRepository == null)
                    _sharedPhotoRepository = new SharedPhotoRepository(_db);
                return _sharedPhotoRepository;
            }
        }

        public IRepository<User> User
        {
            get
            {
                if (_userRepository == null)
                    _userRepository = new UserRepository(_db);
                return _userRepository;
            }
        }

        public IRepository<Video> Video
        {
            get
            {
                if (_videoRepository == null)
                    _videoRepository = new VideoRepository(_db);
                return _videoRepository;
            }
        }

        public IRepository<VideoAlbum> VideoAlbum
        {
            get
            {
                if (_videoAlbumRepository == null)
                    _videoAlbumRepository = new VideoAlbumRepository(_db);
                return _videoAlbumRepository;
            }
        }

        public void Dispose()
        {
            if (disposed == false)
            {
                GC.SuppressFinalize(this);
                disposed = true;
            }
        }
    }
}
