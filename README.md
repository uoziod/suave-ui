# [Suave UI 0.2.0](http://uoziod.github.io/suave-ui)
### UI Framework for AngularJS

Suave UI is inspired by [Actiguide](https://github.com/tansky/actiguide). Current UI framework is designed for 
web-applications based on [AngularJS](http://angularjs.org). It consists of different useful stuff like content grid,
buttons, popups, dropdowns and snackbars.

<div align="center"><a href="http://uoziod.github.io/suave-ui"><img src="manual/images/demo.png" width="385" height="113" /></a></div>


## Components

All components are included into bundle-files.

- [Font Awesome 4.2.0](http://fontawesome.io/) provides icons.
- [Animate.css 3.1.1](http://daneden.github.io/animate.css/) provides CSS-animations. 


## How to use?

To begin use Suave UI you had to add CSS & JS bundle-files and include **suave-ui** angular-module into your web-app
initialization via DI or `angular.bootstrap`.

    <link rel="stylesheet" href="suave-ui/build/styles.min.css" />
    <script src="js/angular.min.js"></script>
    <script src="suave-ui/build/app.min.js"></script>

    <script>
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['my-application', 'suave-ui']);
        });
    </script>

Then you can use Suave UI directives, services and styles right in your code. [Demo & Examples is available here](http://uoziod.github.io/suave-ui).


## License

- **Suave UI** is licensed under the MIT License
- [Font Awesome](http://fontawesome.io/) font is licensed under the SIL OFL 1.1
- [Animate.css](http://daneden.github.io/animate.css/) is licensed under MIT License
