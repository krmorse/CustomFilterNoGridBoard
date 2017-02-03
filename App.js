Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    modelNames: ['UserStory', 'Defect'],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    launch: function() {
        var blackListFields = ['Successors', 'Predecessors', 'DisplayColor'],
            whiteListFields = ['Milestones', 'Tags'];

        this.add({
            xtype: 'rallyinlinefiltercontrol',
            context: this.getContext(),
            height: 26,
            inlineFilterButtonConfig: {
                stateful: true,
                stateId: this.getContext().getScopedStateId('inline-filter'),
                context: this.getContext(),
                modelNames: this.modelNames,
                filterChildren: false,
                inlineFilterPanelConfig: {
                    quickFilterPanelConfig: {
                        defaultFields: ['ArtifactSearch', 'Owner'],
                        addQuickFilterConfig: {
                            blackListFields: blackListFields,
                            whiteListFields: whiteListFields
                        }
                    },
                    advancedFilterPanelConfig: {
                        advancedFilterRowsConfig: {
                            propertyFieldConfig: {
                                blackListFields: blackListFields,
                                whiteListFields: whiteListFields
                            }
                        }
                    }
                },
                listeners: {
                    inlinefilterchange: this._onFilterChange,
                    inlinefilterready: this._onFilterReady,
                    scope: this
                }
            }
        });
    },

    _onFilterReady: function(inlineFilterPanel) {
        this.add(inlineFilterPanel);
    },

    _onFilterChange: function(inlineFilterButton) {
        var filterInfo = inlineFilterButton.getTypesAndFilters();

        if (!this.down('rallygrid')) {
            this.add({
                xtype: 'rallygrid',
                context: this.getContext(),
                columnCfgs: [
                    'FormattedID',
                    'Name',
                    'Owner'
                ],
                context: this.getContext(),
                storeConfig: {
                    models: filterInfo.types,
                    filters: filterInfo.filters
                }
            });
        } else {
            var store = this.down('rallygrid').getStore();
            if (Ext.isEmpty(filterInfo.filters)) {
                store.clearFilter();
            } else {
                store.clearFilter(true);
                store.filter(filterInfo.filters);
            }
        }
    }
});
