define({

  image: {
    matchre: /<img\s+src="(.+?)"[^>]*>/gim,
    matchcb: function (arr, item) {
      return (arr.indexOf(item.thumbUrl) !== -1 ||
              arr.indexOf(item.imageUrl) !== -1);
    }
  },

  video: {
    matchre: /<embed\s+src="(.+?)"[^>]*>/gim,
    matchcb: function (arr, item) {
      return (arr.indexOf(item.src) !== -1);
    }
  },

  gallery: {
    matchre: /<div\s+[^>]*?cms\-component\-id="(.+?)"[^>]*><\/div>/gim,
    matchcb: function (arr, item) {
      return (arr.indexOf(item.id) !== -1);
    }
  }

});
