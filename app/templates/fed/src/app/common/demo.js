define(function(require, exports, module) {
  'use strict';

  var Category = require('../common/category/category');
  var util = require('../common/util');

  module.exports = {
    Category: Category,
    Game: require('../common/game/game'),
    Search: require('../common/search/search'),
    Gallery: require('../common/gallery/browse'),
    TreeGrid: require('../common/treegrid/treegrid'),
    Publish: require('../common/publish/publish'),
    Select: require('../common/select/select'),
    util: util
  };

});
