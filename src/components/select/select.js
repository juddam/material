(function() {
'use strict';
var selectNextId = 0;

/*
 * TODO Is it OK to say an md-option's value can never change?
 */

function hashValue(value) {
  if (angular.isObject(value)) {
    var hash = value.$$hashKey || value.$$mdSelectId;
    if (!hash) {
      hash = value.$$mdSelectId = selectNextId++;
    }
    return hash;
  }
  return value;
}

angular.module('material.components.select', [
  'material.core'
])

.directive('mdSelect', SelectDirective)
.directive('mdLabel', LabelDirective)
.directive('mdOption', OptionDirective)
.directive('mdOptgroup', OptgroupDirective)
.provider('$mdSelect', SelectProvider);

function SelectDirective() {

  return {
    restrict: 'E',
    require: ['mdSelect', 'ngModel'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var selectCtrl = ctrls[0];
    var ngModel = ctrls[1];
    var isMultiple = angular.isDefined(attr.mdMultiple) || angular.isDefined(attr.multiple);

    // For non-multiple, publish the model as a single value
    if (!isMultiple) {
      ngModel.$formatters.unshift(function(value) {
        // TODO case where it is an array?
        return [value];
      });
      ngModel.$parsers.push(function(value) {
        // TODO error if not array. What if already an array?
        return value[0];
      });
    }

    ngModel.$render = render;
    function render() {
      var newSelected = (ngModel.$viewValue || ngModel.$modelValue || []).map(hashValue);
      var oldSelected = Object.keys(selectCtrl.selected);

      var deselectedValues = oldSelected.filter(function(value) {
        return newSelected.indexOf(value) === -1;
      });
      deselectedValues.forEach(selectCtrl.deselect);
      newSelected.forEach(selectCtrl.select);
    }
  }

  function SelectController() {
    var self = this;
    self.options = {};
    self.selected = {};

    self.isSelected = function(value) {
      return self.selected.hasOwnProperty(value);
    };
    self.select = function(value) {
      var element = self.options[value];
      if (element && !self.selected[value]) {
        element.attr('selected', '');
        self.selected[value] = true;
      }
    };
    self.deselect = function(value) {
      var element = self.options[value];
      if (element) {
        element.removeAttr('selected');
        delete self.selected[value];
      }
    };
  }
}

function LabelDirective() {
}

function OptionDirective($parse) {

  return {
    restrict: 'E',
    require: ['mdOption', '^mdSelect'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var optionCtrl = ctrls[0];
    var selectCtrl = ctrls[1];

    var removeOption = selectCtrl.addOption(optionCtrl);
    scope.$on('$destroy', removeOption);

    scope.$watch($attrs.mdValue || $attrs.value, function(newValue, oldValue) {
      var oldHash = hashValue(oldValue);
      var newHash = hashValue(newValue);

      // Remove old value from options
      if (selectCtrl.options.hasOwnProperty(oldHash)) {
        delete selectCtrl.options[oldHash];
      }

      if (angular.isDefined(newHash)) {
        // If this option value already exists, it's a duplicate.
        if (selectCtrl.options.hasOwnProperty(newHash)) {
          throw new Error('No duplicates!');
        }
        selectCtrl.options[newHash] = element;

        // If this option's value was part of our modelValue, then we're selected.
        if (selectCtrl.isSelected(newHash)) {
          selectCtrl.select(newHash);
        }
      }
    });
  }

  function OptionController($scope, $element, $attrs) {
    this.element = $element;
    this.selected = false;
  }
  OptionController.prototype = {
    render: function(values) {
      var isMatch = values.indexOf(this.getValue()) !== -1;
      if (this.selected && !isMatch) {
        $element.removeClass('md-selected');
        this.selected = false;
      } else if (!this.selected && isMatch) {
        $element.addClass('md-selected');
        this.selected = true;
      }
    }
  };

}

function OptgroupDirective() {
}

function SelectProvider() {
}

})();
