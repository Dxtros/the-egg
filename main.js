$(document).ready(function () {
    // Story sections array
   
    const introContent = [
        {
            id: 1,
            narrator: 'You were on your way home when you died.',
            narratorClass: 'intro',
            person: '',
            personClass: '',
            story: '',
            storyClass: '',
            hasButton: false,
            timer: 5000,
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
            timer: 5000,
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
        
//flash anim
$('.flash').addClass('flash-anim');
$('main').empty();


setTimeout(function() {             
        // Start the story
        displayIntroStoryContent(currentIndex);
    }, 3000);
    });

    // Function to display intro story content
    function displayIntroStoryContent(index) {
        // Clear any existing timers and replace with timer value
        if (storyTimer) {
            clearTimeout(storyTimer);
        }
        
        // Check if we're at the end of the content array
        if (index >= introContent.length) {
            setupDialogueSection();
            return;
        }
        
        // Get the current segment
        
        const segment = introContent[index];
        // Display the narrator text 
        
        $('main').html(`
            <div class="intro-div">
                <h1 class="${segment.narratorClass}">${segment.narrator}</h1>
            </div>
        `);
      
            

            // automatically advance after delay
            storyTimer = setTimeout(function() {
                currentIndex++;
                displayIntroStoryContent(currentIndex);
            }, segment.timer);
        
    
            function setupDialogueSection() {
                $('main').html(`
                    <div class="dialogue-section">
                        <h2>Dialogue section will go here</h2>
                    </div>
                `);
                // Add your dialogue logic here
            }
      
}})