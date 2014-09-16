# [Suave UI 0.1.1](http://uoziod.github.io/suave-ui)
### UI Framework for AngularJS

Suave UI is inspired by [Actiguide](https://github.com/tansky/actiguide). This UI framework is designed for 
web-applications based on [AngularJS](http://angularjs.org). It consists of different useful stuff like content grid,
buttons, popups, dropdowns and notifications.


## Components

All components are included into bundle-files.

- [Font Awesome](http://fontawesome.io/) using for icons.
- [Animate.css](http://daneden.github.io/animate.css/) using for CSS-animations. 


## Usage

To start using Suave UI you need to add CSS & JS bundle-files and include **suave-ui** angular-module into your web-app
initialization via DI or `angular.bootstrap`.

    <link rel="stylesheet" href="suave-ui/build/styles.min.css" />
    <script src="js/angular.min.js"></script>
    <script src="suave-ui/build/app.min.js"></script>

    <script>
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['my-application', 'suave-ui']);
        });
    </script>

Then you can use Suave UI public directives and services right in your code. [Demo & Examples is available here](http://uoziod.github.io/suave-ui).


## Suave UI directives

- [suDropdown](#suDropdown)
- [suGrid](#suGrid)
- [suIcon](#suIcon)
- [suIconCircle](#suIconCircle)
- [suPopup](#suPopup)
- [suTarget](#suTarget)


### <a name="suDropdown"/>suDropdown

<img src="demos/images/dd.png" />

This directive is for creating dropdown elements like on following demo. Using as &lt;tag&gt;. Required attribute `anchor`
is using for specified dropdown identification by [suTarget](#suTarget).

    <su-dropdown anchor="dropdown-id">
        <p>This is dropdown</p>
    </su-dropdown>
    
    <a su-target="dropdown-id">Open dropdown</a>


### <a name="suGrid"/>suGrid

Whole content area width could be divided on 6 sections. Width of one column is about 15% + padding between them. First and last columns in row using with <strong>edge</strong> keyword in class-name and have bigger padding before and after column respectively.

It's possible to see following rules visually thankfully `suGrid` directive that enables *grid guidelines*. It should be used as attribute in any tag (but `<body>` is recommended). To turn on and off grid guidelines use **Ctrl + Shift + ~** combination.

<img src="demos/images/grid.png" />


### <a name="suIcon"/>suIcon


### <a name="suIconCircle"/>suIconCircle


### <a name="suPopup"/>suPopup


### <a name="suTarget"/>suTarget



## Suave UI services

- [suSnackbar](#suSnackbar)


### <a name="suSnackbar"/>suSnackbar


## License

- **Suave UI** is licensed under the MIT License
- [Font Awesome](http://fontawesome.io/) font is licensed under the SIL OFL 1.1
- [Animate.css](http://daneden.github.io/animate.css/) is licensed under MIT License
