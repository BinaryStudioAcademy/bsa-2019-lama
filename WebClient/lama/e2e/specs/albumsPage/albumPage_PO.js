class AlbumPage {
    get newAlbum() { return $('div.new-album') };
    get albumName() { return $('input.input[name=name]') };
    get uploadPhotos() { return $('input[type=file]') };
    get uploadedPhotos() { return $$('img.image') };
    get saveButton() { return $$('a.button.is-primary')[3] };
}

module.exports = new AlbumPage;