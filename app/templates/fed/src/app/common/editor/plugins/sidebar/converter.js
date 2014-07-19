define({

  image: function (data) {
    var settings = data.settings,
      content = '<img src="' + (data.thumbUrl || data.imageUrl) +
        '" alt="' + (settings ? settings.remark : '') + '">';

    if (settings && settings.linkOrigin) {
      content = '<a href="' + data.imageUrl + '" target="_blank">' +
        content + '</a>';
    }

    return content;
  }
});
