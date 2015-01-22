describe('<md-select>', function() {

  beforeEach(function() {
    this.addMatchers({
    });
  });

  describe('non-multiple', function() {
    describe('model->view', function() {
      it('renders initial model value');
      it('renders nothing if no initial value is set');
      it('renders model change by selecting new and deselecting old');
      it('renders invalid model change by deselecting old and selecting nothing');
      it('renders all md-options that match modelValue');
    });
    describe('view->model', function() {
      it('should do nothing if clicking selected option');
      it('should deselect old and select new on click');
      it('should keep model value if selected option is removed');
      it('should deselect all md-options on click of different option');
      it('should select an option that was just added matching the modelValue');
    });
  });

  describe('multiple', function() {
    describe('model->view', function() {
      it('renders initial model value');
      it('renders nothing if no initial value is set');
      it('renders adding a value by selecting');
      it('renders taking a value by deselecting');
      it('renders emptying by deselecting all');
      it('renders adding multiple by selecting new');
      it('renders a diff of adding and removing');
      it('renders invalid values by not selecting them');
      it('renders all md-options that match modelValue');
    });
    describe('view->model', function() {
      it('should deselect a selected option on click');
      it('should add a deselected option to selection on click');
      it('should keep model value if a selected option is removed');
      it('should select an option that was just added matching the modelValue');
    });
  });
});
