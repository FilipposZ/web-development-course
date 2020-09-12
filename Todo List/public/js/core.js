$('input[type="checkbox"]').on('change', function(e) {
  $.ajax({
    method: 'delete',
    data: { itemID: $(this).attr('value')}
  });
});
