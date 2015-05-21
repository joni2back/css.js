(function(){

    var formulas = {
        t: 'top',
        b: 'bottom',
        l: 'left',
        r: 'right',

        w: 'width',
        h: 'height',

        p: 'padding',
        m: 'margin',

        br: 'borderRadius',
        fs: 'fontSize',
        fw: 'fontWeight',
        lh: 'lineHeight',

        mt: 'marginTop',
        mb: 'marginBottom',
        ml: 'marginLeft',
        mr: 'marginRight',

        pt: 'paddingTop',
        pb: 'paddingBottom',
        pl: 'paddingLeft',
        pr: 'paddingRight',
    }
   
    var useFormula = function(className) {
        var pieces = className.match(/(^[a-z]{1,3})+([0-9pxempt\%]{1,5})/);
        var formula = pieces && formulas[pieces[1]];
        return formula && {
            key: formula,
            value: pieces[2]
        };
    };

    var parseElementClasses = function(element) {
        var classNames = element && element.className && element.className.split(' ') || [];
        classNames.forEach(function(className) {
            var style = useFormula(className);
            style && style.key && (element.style[style.key] = style.value);
        });
    }

    var apply = function(scopeElement, observe) {
        var scope = scopeElement || window.document;
        var elements = scope.getElementsByTagName('*');
        for (var i in elements) {
            var element = elements[i];
            if (typeof element === 'object') {
                parseElementClasses(element);
                observe && observer.observe(element, { attributes : true, attributeFilter : ['class'] });
            }
        }
    };

    var observer = new window.MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            var element = mutationRecord.target;
            element.lastClassName !== element.className && parseElementClasses(element);
            element.lastClassName = element.className;
        });    
    });

    if (typeof window === 'object' && window.document) {
        window.cssjs = {
            apply: apply,
            formulas: formulas
        }
        return;
    }

    throw new Error('Invalid environment');

})(window);