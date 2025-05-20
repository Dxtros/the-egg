/**
 * The Egg By Andy Weir - retrieved from https://www.galactanet.com/oneoff/theegg_mod.html
 * 
 *  Adapted into an interactive web story by Dexter Delaski - dextros.net
 * 
 * This script manages the interactive story for "The Egg"
 * by Andy Weir, providing animations, transitions, and user interactions.
 */

$(document).ready(() => {
  // Story Engine - manages the story state and progression
  const StoryEngine = {
    // State
    state: {
      currentIndex: 0,
      dialogueIndex: 0,
      activeSection: 'landing', // 'landing', 'intro', 'dialogue', 'ending'
      activeTimer: null,
      animatingOut: false,
      questionScreen: {
        afterlifeAsked: false,
        godAsked: false,
        showingAnswer: false,
        currentAnswer: null

      }
    },

    // Initialize the story engine
    init() {
      this.bindEvents();
      console.log('Story engine initialized');
    },

    // Bind necessary event listeners
    bindEvents() {
      // Main button click handler
      $('.button-begin').on('click', () => this.startStory());

      // Debug keyboard controls
      this.bindDebugControls();
    },

    // Start the story experience
    startStory() {
      console.log('Starting story experience');
      $('.flashScreen').addClass('flash-anim');
      $('main').empty();

      this.state.activeSection = 'intro';
      this.state.currentIndex = 0;

      // Delay first text appearance to allow for flash animation
      setTimeout(() => this.displayIntroContent(0), 3000);
    },

    // Display intro story content
    displayIntroContent(index) {
      console.log(`Displaying intro content at index: ${index}`);
      this.clearActiveTimer();

      // Check if we've reached the end of intro content
      if (index >= StoryContent.intro.length) {
        this.transitionToDialogue();
        return;
      }

      // Get current segment and display it
      const segment = StoryContent.intro[index];
      $('main').html(`
        <div class="intro-div">
          <h1 class="${segment.narratorClass} ${segment.anim}">${segment.narrator}</h1>
        </div>
      `);

      // Set up timer for automatic progression
      this.state.activeTimer = setTimeout(() => {
        const element = document.querySelector('h1');
        this.state.animatingOut = true;

        // Start fade out animation
        this.animateElementOut(element, () => {
          // When animation is complete, move to next segment
          this.state.animatingOut = false;
          this.displayIntroContent(index + 1);
        });
      }, segment.timer);
    },

    // Transition to dialogue section
    transitionToDialogue() {
      console.log('Transitioning to dialogue section');
      this.state.activeSection = 'dialogue';
      this.state.dialogueIndex = 0;
      this.displayDialogueContent();
    },

    // Display dialogue content
    displayDialogueContent() {
      console.log(`Displaying dialogue at index: ${this.state.dialogueIndex}`);


      // show question screen on index #
      if (this.state.dialogueIndex === 6) {
        console.log('Transitioning to question screen');
        this.showQuestionScreen();
        return;
      }

      // Check if we've reached the end of dialogue content
      if (this.state.dialogueIndex >= StoryContent.dialogue.length) {
        console.log('End of story reached');
        // this.transitionToEnding(); // Implement when needed
        return;
      }

      const segment = StoryContent.dialogue[this.state.dialogueIndex];
      this.renderDialogueSegment(segment);

      // Handle progression based on segment type
      if (segment.hasButton) {
        this.addProgressionButton(segment);
      } else {
        this.setupTimedProgression(segment);
      }
    },

    // Render dialogue segment content
    renderDialogueSegment(segment) {
      $('main').html(`
        <div class="segment1-div">
          ${segment.person ? `<p class="${segment.personClass} ${segment.anim || ''}">${segment.person}</p>` : ''}
          ${segment.narrator ? `<p class="${segment.narratorClass} ${segment.anim || ''}">${segment.narrator}</p>` : ''}
        </div>
      `);
    },


    // Add progression button for interactive segments
    addProgressionButton(segment) {
      $('main').prepend('<img class="button-cont" src="img/cont-button-v1.svg">');

      $('.button-cont').on('click', () => {
        console.log('Progression button clicked');

        if (segment.lingerP) {
          $('.person').addClass('fade-text');
        }

        this.advanceDialogue();
      });
    },

    // Set up timed progression for automatic segments
    setupTimedProgression(segment) {
      if (!segment.timer) {
        console.warn('No timer specified for timed segment, using default');
        segment.timer = 3000; // Default timer
      }

      this.state.activeTimer = setTimeout(() => this.handleTimedTransition(segment), segment.timer);
    },

    // Handle timed transition between dialogue segments
    handleTimedTransition(segment) {
      // Collect elements that need to fade out
      const narratorElement = document.querySelector(`.${segment.narratorClass.split(' ')[0]}`);
      const personElement = document.querySelector(`.${segment.personClass.split(' ')[0]}`);

      // Determine which elements should fade and which should remain
      let elementsToFade = [];

      // Narrator element logic
      if (narratorElement && !segment.skipFadeN && !segment.lingerN) {
        elementsToFade.push(narratorElement);
      }

      // Person element logic
      if (personElement && !segment.skipFadeP && !segment.lingerP) {
        elementsToFade.push(personElement);
      }

      // If no elements to fade, advance immediately
      if (elementsToFade.length === 0) {
        this.advanceDialogue();
        return;
      }

      // Set up animation tracking
      let completedAnimations = 0;

      // Apply fade animations
      elementsToFade.forEach(element => {
        this.animateElementOut(element, () => {
          completedAnimations++;
          if (completedAnimations === elementsToFade.length) {
            this.advanceDialogue();
          }
        });
      });
    },

    // Advance to the next dialogue segment
    advanceDialogue() {
      this.clearActiveTimer();
      this.state.dialogueIndex++;
      this.displayDialogueContent();
    },

    // Helper methods
    animateElementOut(element, callback) {
      if (!element) {
        if (callback) callback();
        return;
      }

      // Remove any existing animation classes
      element.classList.remove('animate__fadeIn', 'animate__fadeOut');

      // Add fade out animation
      element.classList.add('animate__animated', 'animate__fadeOut', 'animate__slow');

      // Set up one-time animation end listener
      const handleAnimEnd = (event) => {
        if (event.animationName === 'fadeOut') {
          element.removeEventListener('animationend', handleAnimEnd);
          if (callback) callback();
        }
      };

      element.addEventListener('animationend', handleAnimEnd);
    },

    clearActiveTimer() {
      if (this.state.activeTimer) {
        clearTimeout(this.state.activeTimer);
        this.state.activeTimer = null;
      }
    },

    //question section code ================

    showQuestionScreen() {
      console.log('showing question screen')

      //setup variables from array at button (question section)

      const setup = StoryContent.questions.setup;
      const options = StoryContent.questions.options;

      // html stored in variable
      let html = '<div class="questionScreen">'

      // Add the setup text if not showing an answer
      if (!this.state.questionScreen.showingAnswer) {
        html += `<p class="${setup.class}">${setup.text}</p>`;
      }

      html += `<div class="question-options-container">`;


      let optionsContent = '';

      //===========first question after life section

      //show as grey text if asked
      const afterlifeClass = this.state.questionScreen.afterlifeAsked ?
        `${options[0].class} grey-button` : options[0].class;

      //show clickable afterlife button
      if (!this.state.questionScreen.afterlifeAsked && this.state.questionScreen.currentAnswer != 'god') {
        optionsContent += `<div class="question-option" data-question="afterlife"><p class="${afterlifeClass}"> ${options[0].text}</p></div>`;

      }
      // Show as grey text and not clickable if already asked
      else if (this.state.questionScreen.afterlifeAsked && !this.state.questionScreen.showingAnswer) {
        optionsContent += `<p class="${afterlifeClass} grey-button">${options[0].text}</p>`;
      }
      //show the answer if we are asking the correlating question
      if (this.state.questionScreen.currentAnswer === 'afterlife') {
        const answer = options[0].answer;
        optionsContent += `<p class = "${answer.class}">${answer.text}</p>`

      }

      //===========second question god section

      //show as grey text if asked     
      const godClass = this.state.questionScreen.godAsked ?
        `${options[1].class} grey-button` : options[1].class;

      //show clickable god button bug here! it shows both when both questions havent been asked
      if (!this.state.questionScreen.godAsked && this.state.questionScreen.currentAnswer != 'afterlife') {
        optionsContent += `<div class="question-option" data-question="god"> <p class="${godClass}"> ${options[1].text}</p></div>`;
        console.log(godClass)
      }
      // Show as grey text and not clickable if already asked
      else if (this.state.questionScreen.godAsked && !this.state.questionScreen.showingAnswer) {
        optionsContent += `<p class="${godClass} grey-button">${options[1].text}</p>`;
      }
      //show the answer if we are asking the correlating question
      if (this.state.questionScreen.currentAnswer === 'god') {
        const answer = options[1].answer;
        optionsContent += `<p class = "${answer.class}">${answer.text}</p>`
      }



      //add content from above to surronding html
      html += optionsContent;
      // add closing divs
      html += '</div>';
      html += '</div>';

      //take html and put it into main 
      $('main').html(html)

      //attach click handlers to buttons
      if (!this.state.questionScreen.showingAnswer) {
        console.log("click handler init");
        $('.question-option').on('click', (e) => {
          const question = $(e.currentTarget).data('question');
          console.log(question)
          this.handleQuestionClick(question)
          //bug here ==== grey is only triggered if answer isnt being shown. I dont want click handlers when showing answers but want it to be grey
        });

        //if both questions have been asked continue story after delay
        if (this.state.questionScreen.afterlifeAsked &&
          this.state.questionScreen.godAsked) {

          console.log("Both questions asked, continuing story");

          setTimeout(() => {

            this.state.dialogueIndex = 7;
            this.state.activeSection = 'dialogue';
            this.displayDialogueContent();

          }, 2000); //delay before continuing set here, should add a fade out



        }

      }

    },

    handleQuestionClick(question) {
      console.log('Question clicked:', question);

      //set up to show answer

      this.state.questionScreen.showingAnswer = true;
      this.state.questionScreen.currentAnswer = question

      this.showQuestionScreen();
      //really cool logic that searches the array for the timer value, it stores the options in 
      //opt and then compares to find a the matching question.answer.timer (timer in the array)
      const answerTimer = StoryContent.questions.options.find(
        opt => opt.id === question

      ).answer.timer;
      //marks questions as asked
      setTimeout(() => {

        if (question === 'afterlife') {
          this.state.questionScreen.afterlifeAsked = true;
        }
        if (question === 'god') {
          this.state.questionScreen.godAsked = true;
        }

        //return to setup question screen
        this.state.questionScreen.showingAnswer = false;
        this.state.questionScreen.currentAnswer = null;
        this.showQuestionScreen();

      }, answerTimer);

    },

    //end question section code ================






    // Debug controls
    bindDebugControls() {
      console.log('Binding debug keyboard controls');

      document.addEventListener('keydown', (event) => {
        console.log(`Key pressed: ${event.key}`);

        if(event.key === 'z'){
          
           $('main').empty();
           this.state.dialogueIndex = 11;
            this.displayDialogueContent();
        }

        if (event.key === 'q') {
          console.log('Q pressed - testing question screen');
          // Quick way to jump to question screen for testing
          this.state.activeSection = 'interactive';
          this.state.questionScreen = {
            placeAsked: false,
            godAsked: false,
            showingAnswer: false,
            currentAnswer: null
          };
          this.showQuestionScreen();
        }

        // Handle 'd' key press (advance)
        if (event.key === 'd') {
          console.log('D key pressed - advancing content');

          // clear timers
          if (this.state.activeTimer) {
            clearTimeout(this.state.activeTimer);
            this.state.activeTimer = null;
          }

          // Determine which section 
          if (this.state.activeSection === 'intro') {
            // For intro section, advance to next intro content
            this.state.currentIndex++;
            if (this.state.currentIndex >= StoryContent.intro.length) {
              // If reached the end of intro, move to dialogue
              this.transitionToDialogue();
            } else {
              // Otherwise show next intro content
              this.displayIntroContent(this.state.currentIndex);
            }
          }
          else if (this.state.activeSection === 'dialogue') {
            // For dialogue section, advance to next dialogue
            this.state.dialogueIndex++;
         
            // Refresh
            $('main').empty();
            this.displayDialogueContent();
          }
          else if (this.state.activeSection === 'interactive') {
            // For interactive question section
console.log(this.activeSection)
            // Otherwise, simulate clicking the first available question
            if (!this.state.questionScreen.placeAsked) {
              this.handleQuestionClick('afterlife');
            } else if (!this.state.questionScreen.godAsked) {
              this.handleQuestionClick('god');
            }

            this.showQuestionScreen();


          }
        }

        // Handle 'a' key press (go back)
        else if (event.key === 'a') {
          console.log('A key pressed - going back');

          // clear timers
          if (this.state.activeTimer) {
            clearTimeout(this.state.activeTimer);
            this.state.activeTimer = null;
          }

          // Determine which section 
          if (this.state.activeSection === 'intro') {
            // For intro section, go back to previous content
            this.state.currentIndex = Math.max(0, this.state.currentIndex - 1);
            this.displayIntroContent(this.state.currentIndex);
          }
          else if (this.state.activeSection === 'dialogue') {
            // For dialogue section, go back 
            this.state.dialogueIndex = Math.max(0, this.state.dialogueIndex - 1);
            $('main').empty();
            this.displayDialogueContent();
          }
          else if (this.state.activeSection === 'interactive') {
            // For interactive questions, reset state
            this.state.questionScreen.afterlifeAsked = false;
            this.state.questionScreen.godAsked = false;
            this.state.questionScreen.showingAnswer = false;
            this.state.questionScreen.currentAnswer = null;
            this.showQuestionScreen();
          }
        }
      });
    }
  };

  // Story content - all dialogue and narrative segments
  const StoryContent = {
    // Intro sequence content
    intro: [
      {
        narrator: 'You were on your way home when you died.',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 4000
      },
      {
        narrator: 'It was a car accident. Nothing particularly remarkable, but fatal nonetheless.',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      },
      {
        narrator: 'You left behind a wife and two children.',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 4000
      },
      {
        narrator: "It was a painless death. The EMTs tried their best to save you, but to no avail.",
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      },
      {
        narrator: "Your body was so utterly shattered you were better off, trust me.",
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      },
      {
        narrator: "And that\’s when you met me.",
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      }
    ],

    // Dialogue sequence content
    dialogue: [
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '"What… what happened?" <span class="nar">You asked.</span> "Where am I?"',
        personClass: 'person p-pos-mid',
        anim: 'animate__animated animate__fadeIn animate__slower',
        hasButton: true,
        lingerP: false,
        skipFadeP: false
      },
      {
        narrator: '"You died," <span class="small-narrator">I said, matter-of-factly no point in mincing words.</span>',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '"What… what happened?" <span class="nar">You asked.</span> "Where am I?"',
        personClass: 'person p-pos-mid fade-to-grey',
        hasButton: false,
        timer: 6000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '"There was a… a truck and it was skidding…"',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerP: false,
        skipFadeP: false
      },
      {
        narrator: '"Yup," <span class="nar">I said.</span>',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '"There was a… a truck and it was skidding…"',
        personClass: 'person fade-to-grey p-pos-mid',
        hasButton: false,
        timer: 3000,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '<span class="grey-text">"There was a… a truck and it was skidding…"</span><br><span class="animate__animated animate__fadeIn">"I...I died?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: true,
        lingerP: true,
        skipFadeP: false
      },
      {
        narrator: '"Yup. But don\'t feel bad about it. Everyone dies,"',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="grey-text">"There was a… a truck and it was skidding…"</span><br><span class="fade-to-gray">"I...I died?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '“My kids… my wife,”<span class="nar"> you said.</span>',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
      },
      {
        narrator: '“What about them?”',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">“My kids… my wife,”</span><span class="nar fade-to-grey"> you said.</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: true
      },
      {
        narrator: '<span class = "fade-to-grey">“What about them?”<span>',
        narratorClass: 'narrator n-pos-mid',
        person: '<span class="grey-text">“My kids… my wife,”</span><span class="nar grey-text"> you said.</span><br><span class="animate__animated animate__fadeIn">Will they be all right?</span>',
        personClass: 'person p-pos-bot',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '<span class="animate__animated animate__fadeIn">“That\’s what I like to see,” <span class="nar"> I said.</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '<span class="grey-text">“My kids… my wife,”</span><span class="nar grey-text"> you said.</span><br><span class="grey-text">Will they be all right?</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        lingerN: true,
        lingerP: true,
        timer: 2000,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="fade-to-grey">“That\’s what I like to see,”<span class="nar"> I said.</span></span><br><span class="animate__animated animate__fadeIn">“You just died and your main concern is for your family. That\’s good stuff right there.”</span>',
        narratorClass: 'narrator n-pos-mid animate__slower',
        person: '<span class="grey-text">“My kids… my wife,”</span><span class="nar grey-text"> you said.</span><br><span class="grey-text">Will they be all right?</span>',
        personClass: 'person p-pos-bot animate__slower',
        hasButton: false,
        lingerN: false,
        lingerP: false,
        timer: 6000,
        skipFadeN: false,
        skipFadeP: false
      },
       {
        narrator: 'You looked at me with fascination.',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn',
        personClass: 'person',
        lingerN: false,
        lingerP: true,
        timer: 3000,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="fade-to-grey">You looked at me with fascination.</span><span class="animate__animated animate__fadeIn">To you, I didn’t look like God. I just looked like some man. Or possibly a woman.</span>',
        narratorClass: 'narrator-center n-pos-mid',
        personClass: 'person',
        lingerN: false,
        lingerP: true,
        timer: 3000,
        skipFadeN: true,
        skipFadeP: false
      },
       {
        narrator: '<span class="grey-text">You looked at me with fascination.</span><span class="fade-to-grey"> To you, I didn’t look like God. I just looked like some man. Or possibly a woman.</span><br><span class="animate__animated animate__fadeIn">Some vague authority figure, maybe. More of a grammar school teacher than the almighty.</span>',
        narratorClass: 'narrator-center n-pos-mid',
        personClass: 'person',
        lingerN: false,
        lingerP: true,
        timer: 3000,
        skipFadeN: true,
        skipFadeP: false
      }

    ],

    //question sequence
    questions: {
      setup: {
        text: "You looked around. There was nothingness. Just you and me. You asked...",
        class: "small-narrator animate__animated animate__fadeIn"

      },
      options: [
        {
          id: "afterlife",
          text: '"is this the afterlife"',
          class: 'person question-options-button',
          answer: {
            text: '"More or less"',
            class: 'narrator animate__animated animate__fadeIn',
            timer: 3000
          }
        },
        {
          id: 'god',
          text: 'Are you god?',
          class: 'person question-options-button',
          answer: {
            text: '"Yup, I\'m God"',
            class: 'narrator animate__animated animate__fadeIn',
            timer: 3000
          }
        }
      ]


    }
  };

  // Initialize the story engine
  StoryEngine.init();
});