# [Suave UI 0.1.1](http://uoziod.github.io/suave-ui)
### UI Framework for AngularJS


Suave UI is inspired by [Actiguide](https://github.com/tansky/actiguide). This UI framework is designed for 
web-applications based on [AngularJS](http://angularjs.org). It consists of different useful stuff like content grid,
buttons, popups, dropdowns and notifications.


## Components

All components are included into bundle-files and don't needed to be included separately.

- [Font Awesome](http://fontawesome.io/) using for icons.
- [Animate.css](http://daneden.github.io/animate.css/) using for CSS-animations. 


## Usage

To start using Suave UI you have to add missing CSS & JS files and include **suave-ui** module into your web-application
initialization via DI or *angular.bootstrap*.

    <link rel="stylesheet" href="suave-ui/build/styles.min.css" />
    <script src="js/angular.min.js"></script>
    <script src="suave-ui/build/app.min.js"></script>

    <script>
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['my-application', 'suave-ui']);
        });
    </script>

Then you can use **su-directives** right in your code. [Demo & Examples is available here](http://uoziod.github.io/suave-ui). 


## License

- **Suave UI** is licensed under the MIT License
- [Font Awesome](http://fontawesome.io/) font is licensed under the SIL OFL 1.1
- [Animate.css](http://daneden.github.io/animate.css/) is licensed under MIT License
