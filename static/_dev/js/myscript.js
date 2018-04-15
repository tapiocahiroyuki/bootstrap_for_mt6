$(document).ready(function() {
  $('.rm-code code').each(function(i, block) {
    var txt = $(this).text();
    hljs.highlightBlock(block);
    $(this).parent().find('.clip').attr('data-clipboard-text',txt);
  });
});

$('.clip').tooltip({trigger:'manual',delay:{"hide": 3000}})
.on('mouseleave',function(){
  $(this).tooltip('hide');
}).on('click',function(){
  $(this).tooltip('show');
});

var clipboard = new ClipboardJS('.clip');
clipboard.on('success', function(e) {
  e.clearSelection();
});

