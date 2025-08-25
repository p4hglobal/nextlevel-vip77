# Manual Accessibility Testing Guide

## Screen Reader Testing Procedures

### Test Case SR-001: Screen Reader Navigation
**Objective:** Verify the page is navigable with screen readers

**Tools Required:**
- NVDA (Windows) or JAWS (Windows) or VoiceOver (macOS) or TalkBack (Android)

**Testing Steps:**
1. **Initial Page Load**
   - [ ] Turn on screen reader before loading page
   - [ ] Navigate to campaign website
   - [ ] Listen to page title announcement
   - [ ] Navigate through page structure using headings (H key)

2. **Heading Structure Test**
   - [ ] Use H key to jump between headings
   - [ ] Verify logical heading hierarchy (H1 → H2 → H3)
   - [ ] Confirm heading text describes content accurately
   - [ ] Check that main sections have appropriate headings

3. **Landmark Navigation**
   - [ ] Use landmark navigation (D key in NVDA/JAWS)
   - [ ] Verify main, header, footer, nav landmarks exist
   - [ ] Test "Skip to main content" link functionality
   - [ ] Ensure landmarks have meaningful names

**Expected Results:**
- [ ] Page title clearly describes the page content
- [ ] Heading structure is logical and hierarchical  
- [ ] All major page sections are identified by headings
- [ ] Landmark navigation provides clear page structure
- [ ] Skip links allow efficient navigation

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case SR-002: Interactive Elements Announcement
**Objective:** Verify all interactive elements are properly announced

**Testing Steps:**
1. **Donation Controls**
   - [ ] Navigate to donation amount field
   - [ ] Verify field type and current value are announced
   - [ ] Test increment/decrement buttons
   - [ ] Check button purpose is clearly announced

2. **Video Carousel**
   - [ ] Navigate to video section
   - [ ] Test video element announcements
   - [ ] Check video names are announced
   - [ ] Test carousel navigation controls

3. **Donate Button**
   - [ ] Navigate to main donate button
   - [ ] Verify button purpose is clear
   - [ ] Check if destination is announced

**Expected Results:**
- [ ] Form controls announce type, value, and purpose
- [ ] Buttons announce their action/destination
- [ ] Video elements are identified as videos
- [ ] Interactive elements have descriptive accessible names

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Keyboard Navigation Testing

### Test Case KB-001: Tab Order and Focus Management
**Objective:** Verify proper keyboard navigation throughout the page

**Testing Steps:**
1. **Tab Navigation**
   - [ ] Start at page top, press Tab to navigate
   - [ ] Verify logical tab order through interactive elements
   - [ ] Check focus moves to all interactive elements
   - [ ] Ensure no keyboard traps exist

2. **Focus Indicators**
   - [ ] Confirm visible focus outline on each focusable element
   - [ ] Verify focus outline has sufficient contrast
   - [ ] Check focus outline is not removed by custom CSS
   - [ ] Test focus indicators on all interactive elements

3. **Skip Links**
   - [ ] Tab to first element to reveal skip links
   - [ ] Test "Skip to main content" functionality
   - [ ] Verify skip links are visually apparent when focused

**Focus Order Checklist:**
1. ☐ Skip to main content link
2. ☐ Logo/header navigation (if present)
3. ☐ Main content area
4. ☐ Video carousel controls
5. ☐ Donation amount input
6. ☐ Increment/decrement buttons  
7. ☐ Donate button
8. ☐ Footer links (if present)

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case KB-002: Keyboard Interaction Functionality
**Objective:** Test keyboard alternatives to mouse interactions

**Testing Steps:**
1. **Donation Amount Control**
   - [ ] Tab to amount input field
   - [ ] Use arrow keys to increment/decrement
   - [ ] Test Enter key to confirm changes
   - [ ] Try typing new amounts directly

2. **Video Carousel**
   - [ ] Tab to video carousel area
   - [ ] Use arrow keys to navigate between videos
   - [ ] Test Enter/Space to play videos
   - [ ] Use Escape to exit fullscreen (if applicable)

3. **Donate Button**
   - [ ] Tab to donate button
   - [ ] Press Enter or Space to activate
   - [ ] Verify keyboard activation works same as mouse click

**Expected Results:**
- [ ] All mouse actions have keyboard equivalents
- [ ] Arrow keys work for carousel navigation
- [ ] Enter/Space activate buttons and links
- [ ] Escape key provides expected functionality

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Visual Accessibility Testing

### Test Case VA-001: Color Contrast and Visibility
**Objective:** Verify sufficient color contrast for text and interactive elements

**Tools:** Color contrast analyzer or browser dev tools

**Testing Steps:**
1. **Text Contrast**
   - [ ] Test main body text against background
   - [ ] Check heading text contrast ratios
   - [ ] Verify link text meets contrast requirements
   - [ ] Test button text contrast

2. **Interactive Element Contrast**
   - [ ] Test focus outline contrast
   - [ ] Check button border contrast
   - [ ] Verify form input border contrast
   - [ ] Test hover state contrast

3. **Background Image Impact**
   - [ ] Check text readability over background images
   - [ ] Test with different background rotation images
   - [ ] Verify overlay/background treatment provides adequate contrast

**Contrast Requirements:**
- [ ] Normal text: 4.5:1 minimum
- [ ] Large text (18pt+/14pt bold+): 3:1 minimum  
- [ ] UI components: 3:1 minimum
- [ ] Focus indicators: 3:1 minimum

**Pass/Fail:** ☐ Pass ☐ Fail

**Measured Ratios:** ________________________________

---

### Test Case VA-002: High Contrast Mode Testing
**Objective:** Verify functionality in high contrast display modes

**Testing Steps (Windows):**
1. Enable Windows High Contrast mode
2. Reload the campaign page
3. Test all functionality
4. Verify visual elements remain distinguishable

**Testing Steps (macOS):**
1. Enable "Increase contrast" in System Preferences > Accessibility
2. Test with "Reduce transparency" enabled
3. Verify all elements remain functional and visible

**Expected Results:**
- [ ] All text remains readable
- [ ] Interactive elements are clearly distinguishable
- [ ] Focus indicators remain visible
- [ ] Color-coded information has non-color alternatives

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case VA-003: Magnification and Zoom Testing
**Objective:** Test functionality at high magnification levels

**Testing Steps:**
1. **Browser Zoom Testing**
   - [ ] Test at 125% zoom
   - [ ] Test at 150% zoom
   - [ ] Test at 200% zoom
   - [ ] Test up to 400% zoom

2. **Functionality at Each Zoom Level**
   - [ ] All text remains readable
   - [ ] Interactive elements remain clickable
   - [ ] No horizontal scrolling required
   - [ ] Layout doesn't break

3. **Screen Magnifier Testing**
   - [ ] Test with Windows Magnifier
   - [ ] Test with macOS Zoom feature
   - [ ] Test with mobile zoom gestures

**Expected Results:**
- [ ] Content reflows appropriately
- [ ] No content is cut off or hidden
- [ ] All functionality remains available
- [ ] Performance remains acceptable

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Motor Accessibility Testing

### Test Case MA-001: Touch Target Size Testing
**Objective:** Verify touch targets meet minimum size requirements

**Tools:** Ruler or browser dev tools to measure elements

**Testing Steps:**
1. **Mobile Touch Targets**
   - [ ] Measure donate button size
   - [ ] Measure increment/decrement button sizes
   - [ ] Measure video carousel navigation arrows
   - [ ] Check spacing between adjacent touch targets

2. **Desktop Click Targets**
   - [ ] Test small mouse pointer accuracy
   - [ ] Verify hover areas are appropriate
   - [ ] Check click target boundaries

**Size Requirements:**
- [ ] Minimum 44x44px for touch targets
- [ ] Adequate spacing between adjacent targets (8px minimum)
- [ ] Click/touch area matches visual element size

**Measurements:**
- Donate button: _____ x _____ px
- Increment button: _____ x _____ px  
- Decrement button: _____ x _____ px
- Video nav arrows: _____ x _____ px

**Pass/Fail:** ☐ Pass ☐ Fail

---

### Test Case MA-002: Alternative Input Methods
**Objective:** Test functionality with alternative input devices

**Testing Methods:**
1. **Voice Control (if available)**
   - [ ] Test voice commands for buttons
   - [ ] Try voice input for donation amount
   - [ ] Test navigation commands

2. **Switch Navigation**
   - [ ] Simulate switch access patterns
   - [ ] Test single-switch scanning
   - [ ] Verify all functions are reachable

3. **Head/Eye Tracking**
   - [ ] Test with simulated dwell-click
   - [ ] Verify sufficient dwell time
   - [ ] Check click accuracy requirements

**Expected Results:**
- [ ] All interactive elements are accessible via alternative inputs
- [ ] Sufficient time is provided for input
- [ ] No precision requirements beyond capabilities

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Cognitive Accessibility Testing

### Test Case CA-001: Clear Information Architecture
**Objective:** Verify content is understandable and well-organized

**Testing Steps:**
1. **Content Clarity**
   - [ ] Language is clear and jargon-free
   - [ ] Purpose of page is immediately clear
   - [ ] Instructions are provided where needed
   - [ ] Error messages are helpful

2. **Visual Hierarchy**
   - [ ] Most important elements are prominent
   - [ ] Related content is grouped visually
   - [ ] Consistent layout patterns used
   - [ ] Clear visual separation between sections

3. **Navigation Predictability**
   - [ ] Interactive elements behave consistently
   - [ ] Similar elements work the same way
   - [ ] User can predict what will happen

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case CA-002: Time and Motion Sensitivity
**Objective:** Test for motion sensitivity and time limitations

**Testing Steps:**
1. **Motion and Animation**
   - [ ] Background rotation can be paused/controlled
   - [ ] Video autoplay respects user preferences
   - [ ] No flashing content above safe thresholds
   - [ ] Smooth transitions don't cause disorientation

2. **Time Limitations**
   - [ ] No automatic timeouts for user interactions
   - [ ] User can take time to complete donation process
   - [ ] No content disappears without user control

3. **Reduced Motion Testing**
   - [ ] Enable "Reduce motion" system preference
   - [ ] Verify animations are reduced or eliminated
   - [ ] Check that functionality remains available

**Expected Results:**
- [ ] Animations respect motion preferences
- [ ] No flashing content (3 Hz limit)
- [ ] Users control timing of interactions
- [ ] Alternative static options available

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Assistive Technology Compatibility

### Test Case AT-001: Screen Magnifier Compatibility
**Objective:** Test with screen magnification software

**Tools:** ZoomText, MAGic, or built-in OS magnifiers

**Testing Steps:**
1. **Enable screen magnifier**
2. **Test basic navigation**
   - [ ] Magnifier follows focus properly
   - [ ] Content remains in view when navigating
   - [ ] Scrolling works smoothly with magnification

3. **Test Interactive Elements**
   - [ ] Buttons remain clickable when magnified
   - [ ] Form inputs work properly
   - [ ] Hover states work with magnified cursor

**Pass/Fail:** ☐ Pass ☐ Fail

---

### Test Case AT-002: Voice Recognition Software
**Objective:** Test compatibility with voice control software

**Tools:** Dragon NaturallySpeaking, Windows Speech Recognition, or Voice Control (macOS)

**Testing Steps:**
1. **Voice Navigation**
   - [ ] Can navigate to elements by name
   - [ ] Can activate buttons with voice commands
   - [ ] Can dictate into text fields

2. **Command Recognition**
   - [ ] "Click donate" activates donate button
   - [ ] "Click increment" works for amount controls
   - [ ] Can navigate video carousel with voice

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Accessibility Audit Summary

### WCAG 2.1 Compliance Checklist

#### Level A Requirements
- [ ] Images have alt text
- [ ] Page has proper heading structure
- [ ] Content is keyboard accessible
- [ ] Page has descriptive title
- [ ] Focus is visible

#### Level AA Requirements  
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Text can resize to 200% without loss
- [ ] Content is meaningful without color alone
- [ ] Page is compatible with assistive technologies

#### Level AAA Requirements (optional)
- [ ] Color contrast meets 7:1 ratio
- [ ] No content flashes more than 3 times per second
- [ ] Context-sensitive help is available

### Overall Accessibility Rating

**Critical Issues (Must Fix):** _____
**Major Issues (Should Fix):** _____  
**Minor Issues (Nice to Fix):** _____

### Recommendations

1. **High Priority:**
   - ________________________________
   - ________________________________

2. **Medium Priority:**
   - ________________________________
   - ________________________________

3. **Low Priority:**
   - ________________________________
   - ________________________________

---

**Accessibility Testing Completed By:** ________________

**Date:** ________________

**Overall Accessibility Status:** 
☐ Fully Accessible
☐ Accessible with Minor Issues  
☐ Major Accessibility Barriers Present
☐ Not Accessible - Significant Issues

**Certification:** This testing was conducted according to WCAG 2.1 guidelines and represents the accessibility status as of the test date.