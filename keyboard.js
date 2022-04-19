const keyboard = {
    elements: {
        main:null,
        keysContainer:null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        language: 'en',
        symbols: false,
        emoji: false
    },

    keyLayouts:{
        en: [
            'close',

            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',

            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',

            'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',

            'caps', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace',

            '?123', ',', 'language', 'space', '.', 'emoji', 'enter'
        ],
        nor: [
            'close',

            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',

            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'å',

            'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ø', 'æ',

            'caps', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace',

            '?123', ',', 'language', 'space', '.', 'emoji', 'enter'
        ],
        symbols: [
            'close',

            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',

            '~', '!', '@', '#', '$', '%', '^', '&', '*', '-', '+',

            '`', '|', '[', ']', '\\', ':', '"', '_', ';', '=', '/',

            '©', '®', '£', '€', '(', ')', '<', '>', '?', 'backspace',

            'ABC', ',', 'language', 'space', '.', 'emoji', 'enter'
        ]
    },

    init() {
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        this.elements.main.classList.add('keyboard', 'keyboard_hidden');
        this.elements.keysContainer.classList.add('keyboard_keys');
        this.elements.keysContainer.appendChild(this.createKeyboard(this.keyLayouts.en));
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key');

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll('.virtual_keyboard').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });    
        });
    },

    createKeyboard(layout) {
        const fragment = document.createDocumentFragment();

        const createIcons = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        };
        

        layout.forEach(key => {
            const keyElement = document.createElement('button');
        
            if (layout == this.keyLayouts.en) {
                var insertLineBreak = ['close', '0', 'p', 'l', 'backspace'].indexOf(key) != -1;
            } else if (layout == this.keyLayouts.nor) {
                var insertLineBreak = ['close', '0', 'å', 'æ', 'backspace'].indexOf(key) != -1;
            } else if (layout == this.keyLayouts.symbols) {
                var insertLineBreak = ['close', '0', '+', '/', 'backspace'].indexOf(key) != -1;
            }

            keyElement.setAttribute('type','button');
            keyElement.classList.add('keyboard_key');

            switch(key) {
                case 'backspace':
                    keyElement.classList.add('more_wide_key');
                    keyElement.innerHTML = createIcons('backspace');

                    keyElement.addEventListener('click', () => {
                        let [, rem, del] = this.properties.value.match(/(.*)(.)/u);
                        this.properties.value = rem;
                        //this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this.triggerEvent('oninput');
                    });
                    break;

                case 'caps':
                    keyElement.classList.add('more_wide_key');
                    keyElement.innerHTML = createIcons('keyboard_capslock');

                    keyElement.addEventListener('click', () => {
                        this.toggleCaps();
                        keyElement.classList.toggle('active_button', this.properties.capsLock)
                    });
                    break;

                case 'enter':
                    keyElement.classList.add('wide_key');
                    keyElement.innerHTML = createIcons('keyboard_return');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this.triggerEvent('oninput');
                    });
                    break;

                case 'space':
                    keyElement.classList.add('extra_wide_key');
                    keyElement.innerHTML = createIcons('space_bar');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this.triggerEvent('oninput');
                    });
                    break;  

                case 'close':
                    keyElement.classList.add('closebutton');

                    keyElement.addEventListener('click', () => {
                        this.close();
                        this.triggerEvent('onclose');
                    });
                    break;

                case 'emoji':
                    keyElement.classList.add('wide_key');
                    keyElement.innerHTML = createIcons('insert_emoticon');

                    keyElement.addEventListener('click', () => {
                        this.toggleEmoji();
                        keyElement.classList.toggle('active_button', this.properties.emoji)
                    });
                    break;

                case 'language':
                    keyElement.classList.add('wide_key');
                    keyElement.innerHTML = createIcons('language');

                    keyElement.addEventListener('click', () => {
                        this.toggleLanguage();
                    });
                    break;

                case '?123':
                    keyElement.classList.add('wide_key');
                    keyElement.innerHTML = '?123';

                    keyElement.addEventListener('click', () => {
                        this.toggleSymbols();
                        keyElement.classList.toggle(this.properties.symbols)
                    });    
                    break;

                case 'ABC':
                    keyElement.classList.add('wide_key');
                    keyElement.innerHTML = 'ABC';

                    keyElement.addEventListener('click', () => {
                        this.toggleSymbols();
                        keyElement.classList.toggle(this.properties.symbols)
                    });
                    break;    

                default:
                    keyElement.textContent = key.toLocaleLowerCase();
                    
                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this.triggerEvent('oninput');
                    });
                    break; 
            }

            fragment.appendChild(keyElement);

            if(insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    },


    emojielements: {
        optionsLayout: ['abc', 'sentiment_satisfied', 'emoji_people', 'pets', 'lunch_dining', 'sports_soccer', 'directions_car', 'lightbulb', 'emoji_symbols', 'flag', 'backspace'],
        emojiCategories: [
            {'sentiment_satisfied': 'Smileys & Emotion'},
            { 'emoji_people': 'People & Body'},
            {'pets': 'Animals & Nature'},
            {'lunch_dining': 'Food & Drink'},
            {'sports_soccer': 'Activities'},
            {'directions_car': 'Travel & Places'},
            {'lightbulb': 'Objects'},
            {'emoji_symbols': 'Symbols'},
            {'flag': 'Flags'}
        ]
    },

    
    createEmoji() {
        const frag = document.createDocumentFragment();
        const keyElement = document.createElement('button');
        keyElement.setAttribute('type', 'button');
        keyElement.classList.add('keyboard_key', 'closebutton');
        keyElement.addEventListener('click', () => {
            this.close();
            this.triggerEvent('onclose');
        });

        frag.appendChild(keyElement);
        frag.appendChild(document.createElement('br'));

        const createIcons = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        };

        const options_buttons = document.createElement('div');
        options_buttons.classList.add('option_icons');

        this.emojielements.optionsLayout.forEach(option => {
            const optionElement = document.createElement('button');
            
            optionElement.setAttribute('type', 'button');
            optionElement.classList.add(`${option}`);
            optionElement.classList.add('option_button');
            optionElement.innerHTML = createIcons(`${option}`);

            if (option == 'sentiment_satisfied'){
                optionElement.classList.add('active_option');
            }

            switch(option) {
                case 'abc':
                    optionElement.addEventListener('click', () => {
                        document.querySelector('.keyboard_keys').innerHTML = "";
                        document.querySelector('.keyboard_keys').appendChild(this.createKeyboard(this.keyLayouts[`${this.properties.language}`]));
                        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key');
                    });
                    break;  

                case 'backspace':
                    optionElement.addEventListener('click', () => {
                        let [, rem, del] = this.properties.value.match(/(.*)(.)/u);
                        this.properties.value = rem;
                        this.triggerEvent('oninput');
                    });
                    break;   
                    
                default:
                    optionElement.addEventListener('click', () => {
                        this.toggleOptions(option);
                    });
                    break;     
            }
            options_buttons.appendChild(optionElement);
        });
        frag.appendChild(options_buttons);  

        const allEmojiDiv = document.createElement('div'); 
        allEmojiDiv.classList.add('all_emoji');           

        this.emojielements.emojiCategories.forEach(opt => {
            const option_block = document.createElement('div');
            option_block.classList.add('option_block');
            option_block.setAttribute('id', `${Object.keys(opt)}`);

            if (`${Object.keys(opt)}` != 'sentiment_satisfied'){
                option_block.classList.add('d-none');
            }

            emojis.forEach(emoji => {
                if (emoji['category'] == `${Object.values(opt)}`) {
                    const span_elem = document.createElement('span');
                    span_elem.classList.add('emoji');
                    span_elem.innerHTML = emoji['emoji'];

                    span_elem.addEventListener('click', () => {
                        this.properties.value += span_elem.innerText;
                        this.triggerEvent('oninput');
                    });

                    option_block.appendChild(span_elem);  
                }  
            });

            allEmojiDiv.appendChild(option_block);  
        });
                   
              
        frag.appendChild(allEmojiDiv);

        
        return frag;
    },

    triggerEvent(handler) {
        if (typeof this.eventHandlers[handler] == 'function') {
            this.eventHandlers[handler](this.properties.value);
        }
    },

    toggleCaps() {
        this.properties.capsLock = !this.properties.capsLock;

        for(const key of this.elements.keys) {
            if(key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    toggleEmoji() {
        this.properties.emoji = !this.properties.emoji;

        document.querySelector('.keyboard_keys').innerHTML = "";
        document.querySelector('.keyboard_keys').appendChild(this.createEmoji());
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.emoji');
    },

    toggleOptions(option) {
        const active_option = document.querySelector('.active_option');
        if (active_option) {
            active_option.classList.remove('active_option');
        }
        document.querySelector(`.${option}`).classList.add('active_option');
        
        const optionsblocks = document.querySelectorAll('.option_block');
        optionsblocks.forEach(optionblock => {
            optionblock.classList.add('d-none');
        });
        document.getElementById(`${option}`).classList.remove('d-none');
    },

    toggleLanguage() {
        if (this.properties.language == 'en'){
            this.properties.language = 'nor'
        } else {
            this.properties.language = 'en'
        }
        document.querySelector('.keyboard_keys').innerHTML = "";
        document.querySelector('.keyboard_keys').appendChild(this.createKeyboard(this.keyLayouts[`${this.properties.language}`]));
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key');
    },

    toggleSymbols() {
        this.properties.symbols = !this.properties.symbols;

        document.querySelector('.keyboard_keys').innerHTML = "";
        if (this.properties.symbols){
            document.querySelector('.keyboard_keys').appendChild(this.createKeyboard(this.keyLayouts.symbols));
            this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key');
        } else {
            document.querySelector('.keyboard_keys').appendChild(this.createKeyboard(this.keyLayouts[`${this.properties.language}`]));
            this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key');
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard_hidden');
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard_hidden');
    }
};

window.addEventListener("DOMContentLoaded", function() {
    keyboard.init();
});
