layui.define(['jquery', 'form'], function(exports) {
	var $ = layui.jquery,
		form = layui.form();

	var obj = {
		init: function(settings) {
			var area = new areas();
			area.init(settings);
		}
	};

	var areas = function() {
		var _this = this;
		var settings = {
				elem: "", //包含多个select的layui-form-item
				data: "", //数据，json或地址
				level: 3, //联动等级最大支持4级 需要数据存在四级
				//加入过滤器，实现在同一页面可有多个联动
				provFilter: "", //省份过滤器
				cityFilter: "", //城市过滤器
				distFilter: "", //区县过滤器
				streetFilter: "", //街道过滤器
		};
		
		_this.init = function(options) {
			settings = $.extend(true, {}, settings, options);
			_this.getData();
			return _this.prov();
		}

		_this.getData = function() {
			if(typeof settings.data === 'string') {
				$.ajaxSettings.async = false;
				$.getJSON(settings.data, function(data) {
					settings.data = data;
				});
			}
		}

		_this.prov = function() {
			var option = '<option value="">请选择省份...</option>';
			$.each(settings.data, function(index, item) {
				option += '<option value="' + item.id + '">' + item.areaname + '</option>';
			});
			$(settings.elem).find('select:first').attr('lay-filter', settings.provFilter);
			$(settings.elem).find('select:first').html(option);
			form.render('select');
			if(settings.level > 1) {
				form.on('select(' + settings.provFilter + ')', function(data) {
					_this.city(data.value);
				});
			}
		}

		_this.city = function(prov_id) {
			var area = null;
			$.each(settings.data, function(index, item) {
				if(item.id == prov_id) {
					area = item;
					return true;
				}
			});
			var option = '<option value="">请选择城市...</option>';
			$.each(area.child, function(index, item) {
				option += '<option value="' + item.id + '">' + item.areaname + '</option>';
			});
			$(settings.elem).find('select:eq(1)').attr('lay-filter', settings.cityFilter);
			$(settings.elem).find('select:eq(1)').html(option);
			form.render('select');
			if(settings.level > 2) {
				form.on('select(' + settings.cityFilter + ')', function(data) {
					_this.dist(area.child, data.value);
				});
			}
		}

		_this.dist = function(city, city_id) {
			var area = null;
			$.each(city, function(index, item) {
				if(item.id == city_id) {
					area = item;
					return true;
				}
			});
			var option = '<option value="">请选择区/县...</option>';
			$.each(area.child, function(index, item) {
				option += '<option value="' + item.id + '">' + item.areaname + '</option>';
			});
			$(settings.elem).find('select:eq(2)').attr('lay-filter', settings.distFilter);
			$(settings.elem).find('select:eq(2)').html(option);
			form.render('select');
			if(settings.level > 3) {
				form.on('select(' + settings.distFilter + ')', function(data) {
					_this.street(area.child, data.value);
				});
			}
		}

		_this.street = function(dist, dist_id) {
			var area = null;
			$.each(dist, function(index, item) {
				if(item.id == dist_id) {
					area = item;
					return true;
				}
			});
			var option = '<option value="">请选择街道...</option>';
			$.each(area.child, function(index, item) {
				option += '<option value="' + item.id + '">' + item.areaname + '</option>';
			});
			$(settings.elem).find('select:eq(3)').attr('lay-filter', settings.streetFilter);
			$(settings.elem).find('select:eq(3)').html(option);
			form.render('select');
		}
	}

	//输出areas接口
	exports('areas', obj);
});