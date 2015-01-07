# [Suave UI 0.3.1](http://uoziod.github.io/suave-ui)
### UI Framework for AngularJS

Suave UI is designed for web-applications based on [AngularJS](http://angularjs.org). It consists of CSS definitions, directives and services that helps build UI quick and efficiently.

<div align="center"><a href="http://uoziod.github.io/suave-ui"><img src="https://api.monosnap.com/image/download?id=HMjCJgaZ5celPSjGKTCFpBoO3b4DKw" width="385" height="113" /></a></div>


## Components

All these components are included in bundle-files. So you don't need to include them separately to use all them force.

- [Font Awesome 4.2.0](http://fontawesome.io/) provides icons.
- [Animate.css 3.2.0](http://daneden.github.io/animate.css/) provides CSS-animations. 


## How to use?

You can include Suave UI to your project with [Bower](http://bower.io) by this command:
```
bower install suave-ui --save
```

To use Suave UI without Bower you had to add CSS & JS bundle-files and include `suave-ui` angular-module into your web-app initialization via Dependency Injection or `angular.bootstrap`.

```html
<link rel="stylesheet" href="suave-ui/dist/styles.min.css" />
<script src="js/angular.min.js"></script>
<script src="suave-ui/dist/app.min.js"></script>

<script>
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['your-app', 'suave-ui']);
    });
</script>
```

Then you can use Suave directives, services and styles right in your code. [Demo & Examples is available here](http://uoziod.github.io/suave-ui).


## License

- **Suave UI** is inspired by [Actiguide](https://github.com/tansky/actiguide) licensed under the MIT
- [Font Awesome](http://fontawesome.io/) font is licensed under the SIL OFL 1.1
- [Animate.css](http://daneden.github.io/animate.css/) is licensed under MIT
