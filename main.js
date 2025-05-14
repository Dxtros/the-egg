/**
 * The Egg - Interactive Story Experience
 * 
 * This script manages the interactive story experience for "The Egg"
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
      animatingOut: false
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
      element.classList.add('animate__animated', 'animate__fadeOut');
      
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
    
    // Debug controls for testing
    bindDebugControls() {
      document.addEventListener('keydown', (event) => {
        console.log(`Key pressed: ${event.key}`);
        
        switch (event.key) {
          case 'ArrowRight':
            this.state.currentIndex++;
            break;
          
          case 'ArrowLeft':
            this.state.currentIndex--;
            break;
          
          case 'd':
            this.clearActiveTimer();
            
            if (this.state.activeSection === 'dialogue') {
              this.state.dialogueIndex = Math.min(
                this.state.dialogueIndex + 1, 
                StoryContent.dialogue.length - 1
              );
              $('main').empty();
              this.displayDialogueContent();
            }
            break;
          
          case 'a':
            this.clearActiveTimer();
            
            if (this.state.activeSection === 'dialogue') {
              this.state.dialogueIndex = Math.max(0, this.state.dialogueIndex - 1);
              $('main').empty();
              this.displayDialogueContent();
            }
            break;
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
        anim: 'animate__animated animate__fadeIn',
        timer: 4000
      },
      {
        narrator: 'It was a car accident. Nothing particularly remarkable, but fatal nonetheless.',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn',
        timer: 4000
      },
      {
        narrator: 'lorem ipsum',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn',
        timer: 3000
      }
    ],
    
    // Dialogue sequence content
    dialogue: [
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '"What… what happened?" <span class="small-narrator">You asked.</span> "Where am I?"',
        personClass: 'person p-pos-mid',
        anim: 'animate__animated animate__fadeIn',
        hasButton: true,
        lingerP: false,
        skipFadeP: false
      },
      {
        narrator: '"You died," <span class="small-narrator">I said, matter-of-factly no point in mincing words.</span>',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '"What… what happened?" <span class="small-narrator">You asked.</span> "Where am I?"',
        personClass: 'person p-pos-mid fade-to-grey',
        hasButton: false,
        timer: 8000,
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
        narrator: '"Yup," <span class="small-narrator">I said.</span>',
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
      }
    ]
  };
  
  // Initialize the story engine
  StoryEngine.init();
});