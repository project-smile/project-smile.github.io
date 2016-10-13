(function () {

    var openButton = document.getElementById("open_comments");
    openButton.addEventListener('click', function () {
        openButton.remove();

        (function () {
            var disqus_config = function () {
                this.page.url = window.location.href;
                this.page.identifier = 'card-{id}';
            };
            var d = document, s = d.createElement('script');
            s.src = '//project-smile.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);

        })();

    });
})();
