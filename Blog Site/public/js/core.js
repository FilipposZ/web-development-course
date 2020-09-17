
//Adds the active bootstrap class to the navbar menu item which is displayed
let path = window.location.pathname;
if (path === '/contact') {
  $('.nav-link[href="/contact"]').addClass('active');
} else if (path === '/about') {
  $('.nav-link[href="/about"]').addClass('active');
} else if (path === '/'){
  $('.nav-link[href="/"]').addClass('active');
}
