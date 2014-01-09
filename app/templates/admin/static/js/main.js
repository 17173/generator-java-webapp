var CUI = CUI || {};

// 后台数据接口根路径
CUI.baseUrl = '/';

// 后台数据接口地址配置
CUI.dataUrl = {
    'list': 'user/list.json',
    'pay': 'pay/list.json'
};

// select 数据配置
CUI.optionsData = {
    'status': [{
        'id': 1,
        'name': '完成'
    }, {
        'id': 2,
        'name': '未完成'
    }]
};

CUI.getUrl = function(k) {
    return this.dataUrl[k]
        ? (this.baseUrl + this.dataUrl[k])
        : console.warn('ERR on read cfg ' + k);
}

requirejs.config({
    baseUrl: '../js/lib',
    paths: {
        app: '../app',
        common: '../common',
        'selectize':'../components/selectize/dist/js/standalone/selectize',
        'select2':'../components/select2/select2',
        'bootstrap-datepicker':'../components/bootstrap-datepicker/js/bootstrap-datepicker',
        'bootstrap-daterangepicker':'../components/bootstrap-daterangepicker/daterangepicker',
        'bootstrap-grid':'../components/bootstrap3-grid/script/simplePagingGrid-0.6.0.0',
        moment: '../components/moment/moment',
        jquery: '../components/jquery/jquery'
    },
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'jquery.mockjax': {
            deps:['jquery'],
            exports: '$.mockjax'
        },
        'jquery.validate': {
            deps:['jquery'],
            exports: '$.fn.validate'
        },
        'bootstrap-datepicker': {
            deps:['jquery'],
            exports: '$.fn.datepicker'
        },
        'bootstrap-daterangepicker': {
            deps:['jquery','moment'],
            exports: '$.fn.daterangepicker'
        },
        'bootbox': {
            deps:['jquery'],
            exports: 'bootbox'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'bootstrap3-grid': {
            deps:['jquery','handlebars'],
            exports: '$.fn.simplePagingGrid'
        }
    }
});