document.addEventListener('DOMContentLoaded', () => {

    //empty links
    document.addEventListener('click', (event) => {
        if (event.target.matches('a[href="#"]')) {
            event.preventDefault();
        }
    }, false);

    //----------------------------------------------------------------//

    const body = document.querySelector('body');
    const navigationOpen = document.querySelector('.navigation-toggle');
    if (navigationOpen) {
        navigationOpen.addEventListener('click', event => {
            event.preventDefault();
            body.classList.add('navigation-open-mask');
            body.classList.add('navigation-open');
        });
    }
    const navigationClose = document.querySelector('.navigation-close');
    if (navigationClose) {
        navigationClose.addEventListener('click', event => {
            event.preventDefault();
            body.classList.remove('navigation-open');
            setTimeout(function () {
                body.classList.remove('navigation-open-mask');
            }, 300);
        });
    }

    //----------------------------------------------------------------//

    window.onload = () => {

        let observer = new IntersectionObserver((entries, observer) => {
            for (let index = 0; index < entries.length; index++) {
                const entry = entries[index];

                const thisTarget = entry.target;
                let animate = 'fade-in';
                if (thisTarget.classList.contains('animate-up')) {
                    animate = 'fade-in-up';
                }
                if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                    thisTarget.classList.add('visibility-visible');
                    thisTarget.classList.add(animate);
                    observer.unobserve(thisTarget);
                }
            }
        }, {
            root: null,
            rootMargin: '-100px',
            threshold: 0
        });
        const observeElements = document.querySelectorAll('.animate');
        for (let index = 0; index < observeElements.length; index++) {
            const element = observeElements[index];
            observer.observe(element);
        }

    }

    //----------------------------------------------------------------//

    const mapTips = [
        '<strong>60609</strong><ul><li>Armour Square</li><li>Bridgeport</li><li>Douglas</li><li>Fuller Park</li><li>Gage Park</li><li>Grand Boulevard</li><li>McKinley Park</li><li>New City</li><li>Washington Park</li></ul>',
        '<strong>60653</strong><ul><li>Douglas</li><li>Grand Boulevard</li><li>Kenwood</li><li>Oakland</li></ul>',
        '<strong>60615</strong><ul><li>Grand Boulevard</li><li>Hyde Park</li><li>Kenwood</li><li>Washington Park</li></ul>',
        '<strong>60636</strong><ul><li>Chicago Lawn</li><li>Gage Park</li><li>West Englewood</li></ul>',
        '<strong>60621</strong><ul><li>Englewood</li><li>Greater Grand Crossing</li><li>Washington Park</li></ul>',
        '<strong>60637</strong><ul><li>Greater Grand Crossing</li><li>Hyde Park</li><li>South Shore</li><li>Washington Park</li><li>Woodlawn</li></ul>',
        '<strong>60649</strong><ul><li>SouthShore</li><li>Woodlawn</li></ul>',
        '<strong>60619</strong><ul><li>Avalon Park</li><li>Burnside</li><li>Calumet Heights</li><li>Chatham</li><li>Greater Grand Crossing</li><li>Roseland</li><li>South Shore</li></ul>',
        '<strong>60620</strong><ul><li>Ashburn</li><li>Auburn Gresham</li><li>Beverly</li><li>Chatham</li><li>Englewood</li><li>Greater Grand Crossing</li><li>Roseland</li><li>Washington Heights</li></ul>',
        '<strong>60617</strong><ul><li>Avalon Park</li><li>Calumet Heights</li><li>East Side</li><li>Hegewisch</li><li>South Chicago</li><li>South Deering</li></ul>',
        '<strong>60643</strong><ul><li>Beverly</li><li>Morgan Park</li><li>Washington Heights</li><li>West Pullman</li></ul>',
        '<strong>60628</strong><ul><li>Pullman</li><li>Riverdale</li><li>Roseland</li><li>Washington Heights</li><li>West Pullman</li></ul>',
        '<strong>60633</strong><ul><li>Burnham</li><li>Calumet City</li><li>Chicago</li></ul>',
        '<strong>60406</strong><ul><li>Blue Island</li><li>Dixmoor</li><li>Riverdale</li><li>Posen</li></ul>',
        '<strong>60827</strong><ul><li>Blue Island</li><li>Calumet Park</li><li>Chicago</li><li>Dolton</li><li>Riverdale</li></ul>',
        '<strong>60409</strong><ul><li>Burnham</li><li>Calumet City</li><li>Lansing</li></ul>',
        '<strong>60419</strong><ul><li>Dolton</li></ul>',
        '<strong>60469</strong><ul><li>Posen</li></ul>',
        '<strong>60426</strong><ul><li>Dixmoor</li><li>Harvey</li><li>Markham</li><li>Phoenix</li></ul>',
        '<strong>60473</strong><ul><li>Dolton</li><li>South Holland</li><li>Thornton</li></ul>',
        '<strong>60438</strong><ul><li>Lansing</li></ul>',
        '<strong>60429</strong><ul><li>East Hazel Crest</li><li>Harvey</li><li>Hazel Crest</li><li>Markham</li></ul>',
        '<strong>60476</strong><ul><li>Thornton</li></ul>',
        '<strong>60430</strong><ul><li>Hazel Crest</li><li>Homewood</li><li>Thornton</li></ul>',
        '<strong>60425</strong><ul><li>Glenwood</li></ul>'
    ];
    const map = document.querySelector('#map');
    let instances = [];
    if (map) {
        for (let index = 0; index < mapTips.length; index++) {
            const element = mapTips[index];
            let number = index + 1;
            instances[number] = tippy(document.querySelector('#group-plus-' + number));
            instances[number].setProps({
                allowHTML: true,
                content: element,
                placement: 'top',
                animation: 'scale',
                inertia: true,
            });
            let thisHover = document.querySelector('#group-' + number);
            thisHover.addEventListener('mouseenter', () => {
                instances[number].show();
            });
            thisHover.addEventListener('mouseleave', () => {
                instances[number].hide();
            });
        }
    }

    //----------------------------------------------------------------//

    //definitions
    fetch('./data/dfn.json')
        .then(response => response.json())
        .then(definitions => createTooltips(definitions));

    const createTooltips = (definitions) => {
        const items = document.querySelectorAll('dfn');
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            let elementText = element.innerHTML.toLowerCase().replace(/<[^>]*>?/gm, '').replace(/&nbsp;/gi, ' ');
            let elementJSON = definitions.find(el => {
                for (let counter = 0; counter < el.name.length; counter++) {
                    const thisName = el.name[counter].toLowerCase();
                    if (thisName === elementText) {
                        return el;
                    }
                }
            });
            if (elementJSON) {
                tippy(element, {
                    content: elementJSON.description,
                    allowHTML: true
                });
            } else {
                element.classList.add('dfn-disabled');
            }
        }
    }

    //----------------------------------------------------------------//

    //leadership
    const leadershipRead = document.querySelector('.leadership-read');
    if (leadershipRead) {
        leadershipRead.addEventListener('click', (event) => {
            event.preventDefault();
            leadershipRead.parentNode.closest('.leadership-text').classList.toggle('opened');
        });
    }

    //----------------------------------------------------------------//

    Fancybox.bind("[data-fancybox]", {});

    //----------------------------------------------------------------//

    //two columns read more
    const twoColumnsRead = document.querySelectorAll('.two-columns-read');
    if (twoColumnsRead) {
        for (let index = 0; index < twoColumnsRead.length; index++) {
            const element = twoColumnsRead[index];
            element.addEventListener('click', (event) => {
                event.preventDefault();
                element.parentNode.closest('.two-columns-col').classList.toggle('opened');
            });
        }
    }

    //----------------------------------------------------------------//

    //two columns list
    const twoColumnsItem = document.querySelectorAll('.two-columns-list-item:not(.two-columns-list-item-disabled) .two-columns-list-title');
    if (twoColumnsItem) {
        for (let index = 0; index < twoColumnsItem.length; index++) {
            const element = twoColumnsItem[index];
            element.addEventListener('click', (event) => {
                event.preventDefault();
                if (element.parentNode.closest('.two-columns-list-item').classList.contains('active')) {
                    element.parentNode.closest('.two-columns-list-item').classList.remove('active');
                } else {
                    const parent = element.parentNode.closest('.two-columns-list');
                    const parentActive = parent.querySelector('.two-columns-list-item.active');
                    if (parentActive) {
                        parentActive.classList.remove('active');
                    }
                    element.parentNode.closest('.two-columns-list-item').classList.toggle('active');
                }
            });
        }
    }

    //----------------------------------------------------------------//

    const swiperCards = new Swiper('.cards-block-swiper', {
        speed: 600,
        slidesPerView: 'auto',
        spaceBetween: 10,
        navigation: {
            nextEl: '.cards-block-next',
            prevEl: '.cards-block-prev',
        },
    });

    //----------------------------------------------------------------//

    const swiperGallery = new Swiper('.two-columns-gallery-swiper', {
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    //----------------------------------------------------------------//

}); //DOMContentLoaded

