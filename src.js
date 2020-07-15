/**
 * Wait until the page is ready to be worked on.
 * This may or may not be strictly necessary, but it's a habit that is usually
 * a good idea.
 */
document.addEventListener(
    'DOMContentLoaded',
    (event) => {
        /**
         * We are defining our units generically in one big list rather than
         * putting custom logic in lots of places.
         */
        const units = [
            {
                /**
                 * Name is mostly the display name, but it also is being used
                 * as a unique ID in a few places in the code. You may want to
                 * separate those into two different thing depending on your
                 * use case.
                 */
                name: 'A',

                /**
                 * This runs once per second and should handle any sort of
                 * automatic logic. If B automatically makes more A, you could
                 * reasonably put that logic in either A or B. In this case I
                 * put the logic in the destination, ie A.
                 * 
                 * You may want to invert that logic depending on your
                 * particular game.
                 */
                tick: function(units) {
                    /**
                     * Find the unit with the name of 'B'. You will see this
                     * snippet of code used a lot. It maybe should be in a
                     * helper function.
                     */
                    const b = units.find(
                        (item) => {
                            return item.name == 'B';
                        }
                    );

                    /**
                     * I wrap everything in this sort of protective if
                     * statement in case I have taken B out for some reason.
                     */
                    if (b && b.value > 0) {
                        this.value += b.value * 0.5;
                    }
                },

                /**
                 * The user has clicked on our image. Any rules for when they
                 * can click should be put here. There are no rules for A, but
                 * look at B or others to see that sort of logic.
                 */
                click: function(units) {
                    this.value += 1;
                },

                /**
                 * The description that goes above our image.
                 */
                description: 'One per click',

                /**
                 * Initial value. Almost always going to be 0, but you could
                 * set it to something else, I suppose.
                 */
                value: 0
            },
            {
                name: 'B',
                tick: function(units) {
                    const c = units.find(
                        (item) => {
                            return item.name == 'C';
                        }
                    );
                    if (c && c.value > 0) {
                        this.value += c.value * 0.25;
                    }
                },
                click: function(units) {
                    const a = units.find(
                        (item) => {
                            return item.name == 'A';
                        }
                    );
                    if (a && a.value >= 10) {
                        this.value += 100;
                        a.value -= 10;    
                    }
                },
                description: '1 per 10 A',
                value: 0
            },
            {
                name: 'C',
                tick: function(units) {
                    const d = units.find(
                        (item) => {
                            return item.name == 'D';
                        }
                    );
                    if (d && d.value > 0) {
                        this.value += d.value * 0.1;
                    }
                },
                click: function(units) {
                    const b = units.find(
                        (item) => {
                            return item.name == 'B';
                        }
                    );
                    if (b && b.value >= 100) {
                        this.value += 100;
                        b.value -= 100;
                    }
                },
                description: '1 per 100 B',
                value: 0
            },
            {
                name: 'D',
                tick: function(units) {
                    const e = units.find(
                        (item) => {
                            return item.name == 'E';
                        }
                    );
                    if (e && e.value > 0) {
                        this.value += e.value * 0.05;
                    }
                },
                click: function(units) {
                    const c = units.find(
                        (item) => {
                            return item.name == 'C';
                        }
                    );
                    if (c && c.value >= 100) {
                        this.value += 1;
                        c.value -= 100;
                    }
                },
                description: '1 per 100 C',
                value: 0
            },
            {
                name: 'E',
                tick: function(units) {

                },
                click: function(units) {
                    const d = units.find(
                        (item) => {
                            return item.name == 'D';
                        }
                    );
                    if (d && d.value >= 100) {
                        this.value += 1;
                        d.value -= 100;
                    }
                },
                description: '1 per 100 D',
                value: 0
            }
        ];

        /**
         * In many simple cases the logic below here won't need to be changed.
         * But you can if you want more advanced things.
         */

        /**
         * Create the summary rows and the click areas. This just builds the
         * HTML.
         */
        const rows = document.getElementById('rows');
        units.forEach(
            (item) => {
                const divItem = document.createElement('div');
                divItem.classList.add('col-sm-4');
                divItem.classList.add('unit');
                divItem.addEventListener('click', () => {
                    item.click(units);
                    showUpdate();
                });

                const pName = document.createElement('p');
                pName.innerHTML = item.name;

                const pDescription = document.createElement('p');
                pDescription.innerHTML = item.description;

                const img = document.createElement('img');
                img.src = 'https://picsum.photos/255/255';
                img.classList.add('img-circle');
                img.classList.add('person');
                img.setAttribute('width', 255);
                img.setAttribute('height', 255);

                divItem.appendChild(pName);
                divItem.appendChild(pDescription);
                divItem.appendChild(img);
                rows.appendChild(divItem);

                const displayItem = document.createElement('p');
                displayItem.classList.add('leftalign');
                item.display = displayItem;
                document.getElementById('unit-display').appendChild(displayItem);
            }
        )

        /**
         * Pull the old values from local storage if we have any.
         */
        let storedUnits = window.localStorage.getItem('units');
        if (storedUnits != null) {
            try {
                storedUnits = JSON.parse(storedUnits);
            } catch (e) {
                console.log(e, storedUnits);
            }

            units.forEach(
                (item) => {
                    if (storedUnits[item.name] != undefined) {
                        item.value = storedUnits[item.name];
                    }
                }
            );
        }

        /**
         * Update the screen, called once a second automatically, and also when
         * we click or otherwise know there should be an update.
         */
        function showUpdate() {
            units.forEach(
                (item) => {
                    item.display.innerHTML = 
                        item.name + ' ' + parseFloat(item.value.toFixed(3));
                }
            );
        }

        /**
         * Set up the interval call. This is what gets called once per second.
         */
        window.setInterval(
            () => {
                /**
                 * Collect the things we are eventually going to store in local
                 * storage.
                 */
                let toStore = {};

                units.forEach(
                    (item) => {
                        /**
                         * Call the tick function on each unit in order.
                         */
                        item.tick(units);

                        /**
                         * Update the summary HTML.
                         */
                        item.display.innerHTML =
                            item.name + ' ' + parseFloat(item.value.toFixed(3));
                        
                        /**
                         * Make a note to store this item.
                         */
                        toStore[item.name] = item.value;
                    }
                );

                /**
                 * Do the storing.
                 */
                window.localStorage.setItem('units', JSON.stringify(toStore));
            },
            1000
        );
    }
);