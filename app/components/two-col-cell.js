import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'td',
  classNameBindings: ['selected', 'rowChecked'],
  classNames: ['two-col-select-row'],

  selected: Ember.computed('mouseDragData.selectedRows.@each', 'item.index', 'item.checked', function(){
    return this.get('mouseDragData.selectedRows').indexOf(this.get('item.index')) !== -1;
  }),
  
  rowChecked: Ember.computed('mouseDragData.selectedRows.@each', 'item.index', 'item.checked', function(){
    return this.get('item.checked');
  })
});
