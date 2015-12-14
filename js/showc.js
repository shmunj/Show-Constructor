//vars
var SETTINGS = {
    'MIN_SCENES': 4,
    'MIN_IMPORTANCE': 1,
    'PREV_SCENES': 4,
    'DEFAULT_IMPORTANCE': 50,
    'DEFAULT_DECAY': 10,
};

var classDict = {
    'show_title': 'text',
    'episode_title': 'text',
    'character': 'text',
    'importance': 'number',
    'decay': 'number',
    'setting': 'number',
};

var $input;
var $settings;

var EDITED_ELEMENT = null;
var CANCLICK = true;

//functions
function getShowTitle() {
    //returns current title of the show

    return $($('.show_title')[0]).text();
}

function makeTagClassText(tag, clss, text) {
    //creates and returns new elements based on their tag and, if passed as arguments, class and text

    var element = document.createElement(tag);
    if (clss) {
        $(element).addClass(clss);
    }
    if (text) {
        $(element).text(text);
    }
    return element;
}

function makeSceneElement() {
    //creates and returns a new scene element

    var scene_element = makeTagClassText('div', 'scene');
    
    var importance_element = makeTagClassText('span', null, 'Importance:');
    var importance_input = makeTagClassText('span', 'importance', SETTINGS['DEFAULT_IMPORTANCE']);
    $(importance_input).addClass('edit_me');
    $(importance_element).append(importance_input);
    
    var decay_element = makeTagClassText('span', null, 'Decay:');
    var decay_input = makeTagClassText('span', 'decay', SETTINGS['DEFAULT_DECAY']);
    $(decay_input).addClass('edit_me');
    $(decay_element).append(decay_input);
    
    var description_element = makeTagClassText('textarea', 'description');
    $(description_element).val('Scene description.');

    $(scene_element).append(importance_element);
    $(scene_element).append(decay_element);
    $(scene_element).append(description_element);

    return scene_element;
}

function makeEpisodeElement() {
    //creates and returns a new episode element

    var episode_number = $('.episode').length;

    var episode_element = makeTagClassText('div', 'episode');
    
    var header_element = makeTagClassText('header');
    var episode_number_element = makeTagClassText('h5', 'number', episode_number);
    var episode_title_element = makeTagClassText('h5', 'episode_title', 'Episode Title');
    $(episode_title_element).addClass('edit_me');
    var minimize_button_element = makeTagClassText('button', 'minimize', '-');
    
    var scenespace_element = makeTagClassText('div', 'scenespace');
    var empty_scene_element = makeTagClassText('div', 'scene');
    $(empty_scene_element).addClass('empty');
    
    var scene_button_element = makeTagClassText('button', 'new_scene', 'add scene');
    $(empty_scene_element).append(scene_button_element);
    $(scenespace_element).append(empty_scene_element);
    $(header_element).append(episode_number_element);
    $(header_element).append(episode_title_element);
    $(header_element).append(minimize_button_element);
    $(episode_element).append(header_element);
    $(episode_element).append(scenespace_element);

    return episode_element;
}

function ageScene(scene) {
    //applies decay to importance of a scene

    var $importance = $(scene).find('.importance');
    var importance_int = parseInt($importance.text());
    var $decay = $(scene).find('.decay');
    var decay_int = parseInt($decay.text());

    if (importance_int - decay_int <= SETTINGS['MIN_IMPORTANCE']) {
        $importance.text(SETTINGS['MIN_IMPORTANCE']);
    } else {
        $importance.text(importance_int - decay_int);
    }
}

function generatePreviouslyOn() {
    //generates the "previously on" section
    
    var previouslyOnElement = makeTagClassText('div', 'previously');
    $(previouslyOnElement).append(makeTagClassText('span', null, 'Previously on '));
    var title = makeTagClassText('span', 'show_title', getShowTitle());
    $(title).addClass('edit_us');
    $(previouslyOnElement).append(title);

    var scenes = $('.scene:not(.empty)');
    var total_importance = 0;

    //age all scenes and sum new importance
    for (var i=0; i < scenes.length; i++) {
        var scene = scenes[i];
        ageScene(scene);
        total_importance += parseInt($(scene).find('.importance').text());
    }

    //choose scenes for "previously on" section
    for (var i=0; i < SETTINGS['PREV_SCENES']; i++) {
        //make weighted choice
        var importance_array = [for (s of scenes.toArray()) parseInt($(s).find('.importance').text())];
        var choice_index = getWeightedChoice(importance_array);
        
        //add choice to "previously on" section:
        var text = $(scenes[choice_index]).find('.description').val();
        $(previouslyOnElement).append(makeTagClassText('p', null, text));
        
        //remove the scene from scenes array
        scenes.splice(choice_index, 1);
    }

    return previouslyOnElement;
}

function getWeightedChoice(weightsArray) {
    //makes a weighted choice and returns the index of a chosen item
    
    var total = 0;
    var choice = 0;
    for (var i=0; i < weightsArray.length; i++) {
        total += weightsArray[i];
        if (Math.random() * total < weightsArray[i]) {
            choice = i;
        }
    }
    return choice;
}

function getClass($element) {
    //grabs a class of the editable elements from the element
    
    var classes = $element.attr('class').split(' ');
    var clss;
    
    for (c of classes) {
        if (Object.keys(classDict).indexOf(c) != -1) {
            clss = c;
            break;
        }
    }
    if (clss === undefined) {
        console.log('Couldn\'t find class of element:', $element);
        return false;
    }
    return clss;
}

function popUpInput(e, $element) {
    //pops up the input and edits it
    
    CANCLICK = false;
    var clss = getClass($element);
    $input.addClass(clss);
    $input.attr('type', classDict[clss]);
    $input.val($element.text());
    $input.parents('#popup_input').css({'top': e.pageY, 'left': e.pageX});
    $input.parents('#popup_input').fadeIn();
    $input.focus();
}

function popDownInput() {
    //resets and hides the input pop-up
    
    $input.parents('#popup_input').fadeOut(function() {
        //further changes happen after the element has faded out
        $input.removeClass();
        $input.val('');
        $input.attr('type', '');
        CANCLICK = true;
    
    });
}

function submitInput() {
    //applies changes after the user input
    
    var value = $input.val();
    var clss = getClass($input);
    
    if (EDITED_ELEMENT !== null) {
        //changes should be applied only to this element
        $(EDITED_ELEMENT).text(value);
        
        //check if a setting is being changed
        if (clss == 'setting') {
            var keys = Object.keys(SETTINGS);
            SETTINGS[keys[$settings.find('.setting').index($(EDITED_ELEMENT))]] = value;
        }
    } else {
        //apply to all elements with the same class
        var elements = $('.' + clss);
        for (var i=0; i < elements.length; i++) {
            if($(elements)[i] != $input) {
                $(elements[i]).text(value);
            }
        }
    }
}

function prepareSettings() {
    //fills the settings element with values from the script
    
    var i = 0;
    $settings.find('span').each(function() {
        var keys = Object.keys(SETTINGS);
        $(this).text(SETTINGS[keys[i]]);
        i += 1;
    });
}

//onload
$(function() {

    //important elements
    $input = $('#popup_input input');
    $settings = $('#settings');

    prepareSettings();
    
    //scene button listener
    $('#show').on('click', '.new_scene', function() {
        $(this).parents('.scene').before(makeSceneElement());
    });

    //episode button listener
    $('#show').on('click', '.new_episode', function() {
        var $previous = $('.episode:last').prev();
        
        //check if minimal number of scenes is made
        if ($previous.find('.scene:not(.empty)').length < SETTINGS['MIN_SCENES']) {
            return false;
        }

        previouslyOnElement = generatePreviouslyOn();
        //LOCK last episode - remove button, add no_click classes to clickable items
        //
        var episodeElement = makeEpisodeElement();
        $(episodeElement).find('.scenespace').prepend(previouslyOnElement);
        $(this).parents('.episode').before(episodeElement);
    });

    //minimize button listener
    $('#show').on('click', 'button.minimize', function() {
        $(this).toggleClass('active');
        $(this).parents('.episode').find('.scenespace, .previously').slideToggle();
        ($(this).text() == '+') ? $(this).text('-') : $(this).text('+');
    });

    //change editable spans listener
    $('#show').on('click', '.edit_us, .edit_me', function(e) {
        if (CANCLICK) {
            if ($(this).hasClass('edit_me')) {
                EDITED_ELEMENT = this;
            }
            popUpInput(e, $(this));
        }
    });
    
    //popup_ipnut element listener
    $input.keypress(function(e) {
        if (e.keyCode == 13) {
            submitInput();
            popDownInput();
            EDITED_ELEMENT = null;
        } else if (e.keyCode == 27) {
            popDownInput();
            EDITED_ELEMENT = null;
        }
    });

    //settings button listener
    $('#settings_button').on('click', function() {
        var button = this;
        if (!CANCLICK) {
            return false;
        }

        CANCLICK = false;
        var $first;
        var $second;
        var text;

        if ($('#episodespace').css('display') == 'none') {
            $first = $settings;
            $second = $('#episodespace');
            text = 'SETTINGS';
        } else {
            $first = $('#episodespace');
            $second = $settings;
            text = 'EPISODES';
        }
        
        $first.slideToggle(300, function() {
            $second.slideToggle(300, function() {
                $(button).text(text);
                CANCLICK = true;
            });
        });
    });

});
