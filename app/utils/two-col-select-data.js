import Ember from 'ember';

export default Ember.Object.extend({
  init: function(){
    this._super();
    this.set('list', Ember.A());
  },
  getList: function(){
    return this.get('list');
  },
  addObject: function (item) {
    this.get('list').addObject(item);
  },
  removeObject: function (item) {
    this.getList().removeObject(item);
  },
  loadArray: function (a) {
     a.forEach(function (e) {
      this.addObject(e);
    }.bind(this));
  }
  // add other mutators here that change the state of the data
});
