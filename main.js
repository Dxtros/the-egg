

$(document).ready(function () {

    //story sections

    const storyContent = [
        {
        id: 1,
        narrator: 'You were on your way home when you died',
        narratorClass: '.intro',
        person: '',
        personClass: '',
        story:'',
        storyClass: '',
        hasButton: false,
        timer: '3000',
        linger: false
        },
        {
            id: 2,
            narrator: 'It was a car accident, nothing particularly remarkable',
            narratorClass: '.intro',
            person: '',
            personClass: '',
            story:'',
            storyClass: '',
            hasButton: false,
            timer: '3000',
            linger: false
            },

    ];

    let currentIndex = 0;

    function displayStorySegment(index){
        const segment = storyContent[index];

        $('.begin-button').on("click", function(){

function advanceStory()
        }

    )
        
if (segment.index > 3) {
        $('.center-text').html('<p class="${segment.narrator}</p>');
    }


    function advanceStory(){
        storyContent.index ++;
        alert("story increased");
    }
}



//     if ($('.story-content').length === 0) {
//         $('main').html(`
//             <div class="story-content">
//                 <div class="left"></div>
//                 <div class="right"></div>
//                 <div class="button-area"></div>
//             </div>
//         `);
//     }

// });



