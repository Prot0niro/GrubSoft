function activarNavLi (liId) {
	var NAVBAR_ID = '#navbarUl';
	var ACTIVE_CLASS = 'active';
	window.$(NAVBAR_ID + '>li.' + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
	window.$(liId).addClass(ACTIVE_CLASS);
}
