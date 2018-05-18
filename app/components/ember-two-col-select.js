import Ember from 'ember';
import TwoColSelectData from '../utils/two-col-select-data';
import $ from 'jquery';
const { service } = Ember.inject;

/**
 * @param {Array} leftTableColumns - Array of objects, each object contains the keys {string} field and {string} title
 * @param {Array} rightTableColumns - Array of objects, each object contains the keys {string} field and {string} title
 * @param {EmberArray} leftTableData - Ember array of all the objects to appear in the left column
 * @param {EmberObjectAttribute} rightTableData - The ember object and attribute that the right/selected column is bound to
 * @param {boolean} grouping
 *
*/
export default Ember.Component.extend({
    init() {
      this._super(...arguments);

      let leftColData = TwoColSelectData.create();
      let rightColData = TwoColSelectData.create();

      // ensures not objects that are destoryed somehow to into list
      this.set('leftTableDataList', this.get('leftTableDataList').filterBy('isDestroyed', false));
      leftColData.loadArray(this.get('leftTableDataList'));
      this.set('leftTableData', leftColData);
      this.get('leftTableData').getList().forEach(function(item){
        item.set('checked', false);
      });

      // ensures not objects that are destoryed somehow to into list
      this.set('rightTableDataList', this.get('rightTableDataList').filterBy('isDestroyed', false));
      rightColData.loadArray(this.get('rightTableDataList'));
      this.set('rightTableData', rightColData);
      this.get('rightTableData').getList().forEach(function(item){
        item.set('checked', false);
      });

      this.set('leftMouseDragData',{
        'selectedRows': Ember.A(),
        'selectedIds': Ember.A(),
        'dragging': false
      });

      this.set('rightMouseDragData',{
        'selectedRows': Ember.A(),
        'selectedIds': Ember.A(),
        'dragging': false
      });

    },

    /* Defaults */
    store: service('store'),
    grouping: false, // Group items by a field
    groupByColumn: '', // Which field to group items by, if grouping is enabled
    rowLabel: "name",
    applyAutoFilter: false,
    showFilters: false,
    sortKey: "name",
    customData: null,
    leftAllChecked: false,
    rightAllChecked: false,

    rightGrouping: Ember.computed('grouping', 'rightGrouped', function(){
      return this.get('grouping') || this.get('rightGrouped');
    }),
    leftMouseDragData: {
      'selectedRows': Ember.A(),
      'selectedIds': Ember.A(),
      'dragging': false
    },
    rightMouseDragData: {
      'selectedRows': Ember.A(),
      'selectedIds': Ember.A(),
      'dragging': false
    },
    filteredLeftTableData: Ember.computed('leftTableData.list.length', 'leftTableData' ,function(){
      //apply any filter logic here
      return this.sortColumn(this.get('leftTableData').getList());
    }),
    filteredRightTableData: Ember.computed('rightTableData.list.length', 'rightTableData', function(){
      //apply any filter logic here
      return this.sortColumn(this.get('rightTableData').getList());
    }),
    currentLeftColResults: Ember.computed('filteredLeftTableData.length', function(){
      return this.get('filteredLeftTableData').toArray().length;
    }),
    totalLeftColResults: Ember.computed('leftTableData.list.length', function(){
      return this.get('leftTableData').getList().toArray().length;
    }),
    currentRightColResults: Ember.computed('filteredRightTableData.length', function(){
      return this.get('filteredRightTableData').toArray().length;
    }),
    totalRightColResults: Ember.computed('rightTableData.list.length', function(){
      return this.get('rightTableData').getList().toArray().length;
    }),
    leftSideEmpty: Ember.computed('currentLeftColResults', function(){
      return this.get('currentLeftColResults') === 0;
    }),
    rightSideEmpty: Ember.computed('currentRightColResults', function(){
      return this.get('currentRightColResults') === 0;
    }),

    moveItems: function(ids, sourceSide, targetSide){
      this.sendAction('moveItems', ids, sourceSide, targetSide);
    },

    sortColumn: function(data){
      //set index's to rows for drag select
      if(this.get('grouping')){
        data.sortBy(this.get('groupByColumn'), this.get('sortKey')).forEach(function(item, index) {
          item.set('index', index);
        });
      }else{
        data.sortBy(this.get('sortKey')).forEach(function(item, index) {
          item.set('index', index);
        });
      }
      return data;
    },

    actions: {
        move(){
          var leftItems = this.get('leftTableData').getList().filterBy('checked', true);
          var rightItems = this.get('rightTableData').getList().filterBy('checked', true);
          //move from left to right
          this.send("moveItems", leftItems, "left", "right");
          this.sendAction('moveItems', leftItems,"left", "right");
          //move from right to left
          this.send("moveItems", rightItems, "right", "left");
          this.sendAction('moveItems', rightItems, "right", "left");

          this.setProperties({
            leftAllChecked: false,
            rightAllChecked: false
          });
        },
        moveItems: function(itemsToMove, sourceSide){
          var source, dest;
          if(sourceSide === "left"){
            source = this.get('leftTableData');
            dest = this.get('rightTableData');
          }else{
            source = this.get('rightTableData');
            dest = this.get('leftTableData');
          }
          itemsToMove.forEach(function(item){
            dest.addObject(item);
            source.removeObject(item);
            item.set('checked', false);
          }.bind(this));
        }
    }//end actions
});
