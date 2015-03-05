
/*global AppPlayerSearch, YT */

var AppPlaylist = function(config){
  config      = $.extend(AppPlaylist.default_config, config);
  var self    = this;

  var init = function(){
    self.$el = $('#playlist');
    $(document).on('click', '#playlist-clear', function(){
      self.save([]).clearHTML();
    });
    $(document).on('click', '#playlist-impex', self.impex);

    self.load().render();
  };

  this.clearHTML = function() {
    self.$el.html('');

    return self;
  }

  this.render = function() {
    self.clearHTML();

    for (var i = 0; i < self.items.length; i++) {
      self.append(self.items[i]);
    }

    return self;
  }

  this.add = function(id) {
    var existing = self.items.filter(function(item){
      return item == id;
    });
    if (existing.length) {
      return;
    }

    self.items.push(id);
    self.save().append(id);

    return self;
  }

  this.delete = function(id) {
    var items = self.items.filter(function(item){
      return item != id;
    });

    self.save(items).render();

    return self;
  }

  this.append = function(id) {
    if (!id || id == '') {
      return;
    }

    var $result = $('<li></li>');
    self.$el.append($result);
    YTHelper.get(YTHelper.SEARCH_TYPE_VIDEO, id, function(data) {
      $result.html(AppView.format_playlist_result(new YTHelper.YTRecord(data.entry)));
      self.enableSortable();
    });

    return self;
  }

  this.enableSortable = function() {
    self.$el.sortable('destroy');
    self.$el.sortable({
      handle: '.sort'
    }).bind('sortupdate', function() {
      var items = [];
      self.$el.find('li').each(function(idx, el){
        items.push($(el).data('id'));
      });

      self.save(items);
    });

    return self;
  }

  this.save = function(items) {
    if (items) {
      var filtered = self.items.filter(function(item){
        return item != '';
      });

      self.items = filtered;
    }

    window.localStorage.setItem(config.key, self.items);

    return self;
  }

  this.load = function() {
    var stored = window.localStorage.getItem(config.key);

    var items = [];
    if (stored) {
      items = stored.split(',');
    }

    self.items = items;

    return self;
  }

  this.impex = function() {
    var current = self.items.join(',');
    var next = window.prompt('Copy the following string if you want to save. Paste it later to import it!', current);

    if (!next || current == next) {
      return;
    }

    var items = [];

    if (next.length) {
      items = next.split(',');
    }

    self.save(items).render();

    return self;
  }

  init();
};

AppPlaylist.default_config = {
  key: 'playlist'
};
