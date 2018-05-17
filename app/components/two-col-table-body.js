import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('mouseDragData.dragging', false);
  },
  tagName: 'div',
  firstId: 0,
  firstRow: 0,
  mouseDown: function(event) {
    if(event.which !== 1 || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    this.set('mouseDragData.dragging', true);
    var uid = $(event.target).data().uid;
    var row = parseInt($(event.target).attr('data-row'));
    this.setProperties({firstId: uid, firstRow: row});
    this.get('mouseDragData.selectedIds').push($(event.target).data());
    this.get('mouseDragData.selectedRows').push(row);
    $(event.target).parent().addClass("selected");
  },
  mouseUp: function() {
    if(this.get('mouseDragData.dragging')){
      var ids = this.get('mouseDragData.selectedIds').mapBy('uid');
      this.get('data').forEach(function(item){
        if(ids.indexOf(parseInt(item.get('id'))) >= 0){
          item.set('checked', !item.get('checked'));
        }
      });
      this.clearSelection();
    }
    return true;
  },
  mouseMove: function(event){


    if(this.get('mouseDragData.dragging') ){
      if('row' in $(event.target).data()){
        var row = parseInt($(event.target).attr("data-row"));
        var side = $(event.target).data().side;

        var selectedIdsRecomputed = [];
        var selectedRowsRecomputed = [];
        //re create both arrays by grabbing the first item in list and getting silbling until we get this one and re contruct arrays
        var firstRow = this.get('firstRow');
        var i, currentDiv;
        if(row > firstRow){
          //dragging down
          for(i=firstRow; i <= row; i++){
            currentDiv = $(event.target).closest('.two-col-select-wrapper').find('.two-col-select-item[data-row='+i+'][data-side="'+side+'"]');
            selectedIdsRecomputed.push(currentDiv.data());
            selectedRowsRecomputed.push(parseInt(currentDiv.attr("data-row")));
          }
        }else{
          //dragging up
          for(i=firstRow; i >= row; i--){
            currentDiv = $(event.target).closest('.two-col-select-wrapper').find('.two-col-select-item[data-row="'+i+'"][data-side="'+side+'"]');
            selectedIdsRecomputed.push(currentDiv.data());
            selectedRowsRecomputed.push(parseInt(currentDiv.attr("data-row")));
          }
        }

        //set the arrays to new values that will include any that were skipped over
        this.set('mouseDragData.selectedIds', selectedIdsRecomputed);
        this.set('mouseDragData.selectedRows', selectedRowsRecomputed);

      }
    }
  },
  clearSelection(){
    $('.selected').removeClass('selected');
    this.set('mouseDragData', {
      'selectedRows': Ember.A(),
      'selectedIds': Ember.A(),
      'dragging': false
    });
  },
  actions: {
    moveItems: function(){
      this.sendAction('moveItemsUp', this.get('mouseDragData.selectedIds'));
    }
  }
});
