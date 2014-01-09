require(['../main'], function (main) {
    require(['app/<%= _.slugify(name) %>']);
});