$(document).ready(function () {
    // Story sections array
    const storyContent = [
        {
            id: 1,
            narrator: 'You were on your way home when you died.',
            narratorClass: 'intro',
            person: '',
            personClass: '',
            story: '',
            storyClass: '',
            hasButton: false,
            timer: 3000,
            linger: false
        },
        {
            id: 2,
            narrator: 'It was a car accident. Nothing particularly remarkable, but fatal nonetheless.',
            narratorClass: 'intro-narrator',
            person: '',
            personClass: '',
            story: '',
            storyClass: '',
            hasButton: false,
            timer: 3000,
            linger: false
        },
        {
            id: 3,
            narrator: 'lorem ipsum',
            narratorClass: 'intro-narrator',
            person: '',
            personClass: '',
            story: '',
            storyClass: '',
            hasButton: false,
            timer: 3000,
            linger: false
        },
      
    ];

    let currentIndex = 0;
    let storyTimer;

    // Handle the begin button on the landing page
    $('.button-begin').on('click', function() {
            $('.flash').addClass('flash-anim');

        // Replace content on the same page

        
        // Start the story
        displayIntroStoryContent(currentIndex);

    });

    // Function to display intro story content
    function displayIntroStoryContent(index) {
        // Clear any existing timers
        // if (storyTimer) {
        //     clearTimeout(storyTimer);
        // }
        
        // Check if we're at the end of the content array
        // if (index >= storyContent.length) {
        //     setupDialogueSection();
        //     return;
        // }
        
        // Get the current segment
        const segment = storyContent[index];
        
        // Display the narrator text 
        $('main').html(`
            <div class="intro-div">
                <h1 class="center-text narrator animate__animated animate__fadein intro">${segment.narrator}</h1>
            </div>

        `);
        
        }
            
if (segment.timer > 0) {
            // If no button and has timer, automatically advance after delay
            storyTimer = setTimeout(function() {
                currentIndex++;
                displayIntroStoryContent(currentIndex);
            }, segment.timer);
        
    }

})