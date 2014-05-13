module.exports = {
    getFile: function(s) {
        return 'WEB-INF/template/ftl/' + s + '/index';
    },
    store: {
        ctx: 'http://localhost:8080'
    }
}