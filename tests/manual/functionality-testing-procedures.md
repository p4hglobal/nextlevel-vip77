# Manual Functionality Testing Procedures

## Background Image Rotation Testing

### Test Case BG-001: Initial Background Load
**Objective:** Verify the initial background image loads correctly

**Steps:**
1. Clear browser cache and cookies
2. Navigate to the campaign page
3. Wait for page to fully load
4. Observe the background image

**Expected Results:**
- [ ] Background image loads within 3 seconds
- [ ] Image is properly scaled (background-size: cover)
- [ ] Image is centered and doesn't distort
- [ ] Image relates to P4H Global's mission/work

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case BG-002: 60-Second Rotation Timer
**Objective:** Verify background images rotate every 60 seconds

**Steps:**
1. Load the page and note the initial background image
2. Start a 60-second timer
3. Watch for background change at the 60-second mark
4. Continue timing for next rotation
5. Repeat for at least 3 rotations

**Expected Results:**
- [ ] Background changes at 60-second intervals (±2 seconds tolerance)
- [ ] Timer is consistent across rotations
- [ ] New background image loads smoothly

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case BG-003: Fade Transition Effect
**Objective:** Verify smooth fade transition between background images

**Steps:**
1. Wait for a background rotation to occur
2. Observe the transition effect
3. Note the transition duration
4. Check for any visual glitches

**Expected Results:**
- [ ] Transition uses fade effect (not cut/slide)
- [ ] Transition duration is 1-3 seconds
- [ ] No flickering or visual artifacts
- [ ] Previous image fades out as new image fades in

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case BG-004: Multiple Background Images
**Objective:** Verify multiple different background images are used

**Steps:**
1. Stay on page for at least 5 minutes
2. Record each background image that appears
3. Note any repetition patterns
4. Verify images are from P4H Global source

**Expected Results:**
- [ ] At least 3 different background images
- [ ] Images don't repeat immediately
- [ ] All images are relevant to P4H Global's work
- [ ] Images are high quality and appropriate

**Pass/Fail:** ☐ Pass ☐ Fail

**Images Observed:** ________________________________

---

## Video Carousel Testing

### Test Case VC-001: Video Display and Loading
**Objective:** Verify videos from the videos directory are displayed correctly

**Steps:**
1. Navigate to the campaign page
2. Locate the video carousel section
3. Observe the video display
4. Check video file sources

**Expected Results:**
- [ ] "Liam Helmer.mp4" video is displayed
- [ ] Video poster/thumbnail shows before playing
- [ ] Video name "Liam Helmer" is clearly labeled
- [ ] Video controls are accessible

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case VC-002: Navigation Arrow Functionality
**Objective:** Test left/right navigation arrows control video playback

**Pre-requisites:** Multiple videos in carousel (add more test videos if needed)

**Steps:**
1. Locate the left and right navigation arrows
2. Click the right arrow
3. Observe carousel movement
4. Click the left arrow
5. Test arrow behavior at carousel ends

**Expected Results:**
- [ ] Right arrow advances to next video
- [ ] Left arrow goes to previous video
- [ ] Arrows are disabled/hidden at carousel ends
- [ ] Smooth transition animation between videos
- [ ] Current video indicator updates

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case VC-003: Video Name Display
**Objective:** Verify video names are extracted correctly from filenames

**Steps:**
1. View each video in the carousel
2. Check the displayed name matches the filename
3. Verify name formatting (e.g., "Liam Helmer" from "Liam Helmer.mp4")
4. Test with videos containing special characters

**Expected Results:**
- [ ] Video name displays correctly
- [ ] Filename extension (.mp4) is removed
- [ ] Spaces and capitalization are preserved
- [ ] Special characters are handled gracefully

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case VC-004: Video Playback Controls
**Objective:** Test video playback functionality

**Steps:**
1. Click on a video to start playback
2. Test pause/play controls
3. Test volume controls
4. Test fullscreen mode
5. Test seeking/scrubbing

**Expected Results:**
- [ ] Video plays when clicked/tapped
- [ ] Play/pause button works correctly
- [ ] Volume controls are functional
- [ ] Fullscreen mode works
- [ ] Seeking works smoothly

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Donation Amount Editor Testing

### Test Case DA-001: Default Amount Display
**Objective:** Verify the default donation amount is $200

**Steps:**
1. Load the campaign page
2. Locate the donation amount display
3. Check the default value
4. Verify currency formatting

**Expected Results:**
- [ ] Default amount shows $200
- [ ] Currency symbol ($) is displayed
- [ ] Amount is clearly formatted
- [ ] Amount is prominently displayed

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case DA-002: Click-to-Edit Functionality
**Objective:** Test editing donation amount by clicking

**Steps:**
1. Click on the donation amount
2. Observe if editing mode is activated
3. Type a new amount (e.g., 150)
4. Click elsewhere or press Enter
5. Verify the amount updates

**Expected Results:**
- [ ] Clicking amount enables editing
- [ ] Input field appears or becomes editable
- [ ] Can type new amount
- [ ] Amount updates when editing is complete
- [ ] Invalid entries are handled gracefully

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

### Test Case DA-003: Increment/Decrement Arrows
**Objective:** Test up/down arrows for $50 increments

**Steps:**
1. Locate the increment (+) and decrement (-) buttons
2. Click increment button multiple times
3. Note amount changes
4. Click decrement button multiple times
5. Test at boundary values (e.g., $0)

**Expected Results:**
- [ ] Increment button increases amount by $50
- [ ] Decrement button decreases amount by $50
- [ ] Amount cannot go below $0
- [ ] Buttons are clearly labeled or have icons
- [ ] Changes are immediate and visible

**Pass/Fail:** ☐ Pass ☐ Fail

**Test Values:**
- Starting: $ _____ 
- After 3 increments: $ _____
- After 2 decrements: $ _____

---

### Test Case DA-004: Input Validation
**Objective:** Test handling of invalid donation amounts

**Steps:**
1. Try entering negative amounts
2. Try entering non-numeric characters
3. Try entering extremely large amounts
4. Try entering decimal values
5. Test empty/blank input

**Expected Results:**
- [ ] Negative amounts are rejected or converted to positive
- [ ] Non-numeric input is filtered or rejected
- [ ] Large amounts are handled appropriately
- [ ] Decimal handling is consistent with design
- [ ] Empty input reverts to default or shows error

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Donation URL Generation Testing

### Test Case DU-001: Default URL Generation
**Objective:** Verify correct Kindful URL with default amount

**Steps:**
1. Load page with default $200 amount
2. Inspect or hover over donate button to see URL
3. Copy the link address
4. Verify URL components

**Expected Results:**
- [ ] URL contains: p4hglobal.kindful.com
- [ ] URL contains: campaigns/1374266
- [ ] URL contains: amount=200
- [ ] URL contains: recurring=landing_recurring
- [ ] URL contains: frequency parameter

**Actual URL:** ________________________________

**Pass/Fail:** ☐ Pass ☐ Fail

---

### Test Case DU-002: Dynamic URL Updates
**Objective:** Test URL updates when amount changes

**Steps:**
1. Change donation amount to $300
2. Check donate button URL
3. Change amount to $150
4. Check URL again
5. Test with various amounts

**Expected Results:**
- [ ] URL updates immediately when amount changes
- [ ] amount parameter reflects current value
- [ ] Other URL parameters remain unchanged
- [ ] URL encoding is correct

**Test Matrix:**
- Amount: $300 → URL: ________________________________
- Amount: $150 → URL: ________________________________
- Amount: $1000 → URL: ________________________________

**Pass/Fail:** ☐ Pass ☐ Fail

---

### Test Case DU-003: URL Parameter Accuracy
**Objective:** Verify all required URL parameters are present and correct

**Steps:**
1. Set amount to $500
2. Right-click donate button and copy link
3. Paste URL into text editor
4. Parse and verify each parameter

**Expected URL Format:**
```
https://p4hglobal.kindful.com/campaigns/1374266?amount=500&recurring=landing_recurring&frequency=
```

**Parameter Checklist:**
- [ ] Domain: p4hglobal.kindful.com
- [ ] Campaign ID: 1374266  
- [ ] Amount matches current selection
- [ ] Recurring parameter: landing_recurring
- [ ] Frequency parameter present (can be empty)

**Pass/Fail:** ☐ Pass ☐ Fail

---

### Test Case DU-004: Donate Button Click Behavior
**Objective:** Test actual donation process initiation

**Steps:**
1. Set donation amount to $250
2. Click the donate button
3. Observe navigation/popup behavior
4. Verify landing on correct Kindful page
5. Check pre-filled amount on Kindful page

**Expected Results:**
- [ ] Button click navigates to Kindful site
- [ ] Opens in same tab or new tab (as designed)
- [ ] Lands on correct campaign page
- [ ] Donation amount is pre-filled correctly
- [ ] Campaign information is displayed

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Content Integration Testing

### Test Case CI-001: P4H Global Logo Display
**Objective:** Verify P4H Global logo is prominently displayed

**Steps:**
1. Locate the P4H Global logo on the page
2. Check logo quality and sizing
3. Verify logo links to appropriate destination
4. Test logo on different screen sizes

**Expected Results:**
- [ ] Logo is clearly visible
- [ ] Logo is high resolution/quality
- [ ] Logo placement is prominent
- [ ] Logo is clickable (if designed to be)

**Pass/Fail:** ☐ Pass ☐ Fail

---

### Test Case CI-002: Campaign Content Display
**Objective:** Verify campaign-specific content is displayed

**Steps:**
1. Read through all text content on page
2. Check for campaign-specific messaging
3. Verify information accuracy
4. Check for proper attribution

**Expected Content Elements:**
- [ ] True North - VIP 77 attribution
- [ ] P4H Global campaign information
- [ ] Haiti education focus mentioned
- [ ] Transformation/empowerment messaging
- [ ] Call-to-action text

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:** ________________________________

---

## Cross-Browser Testing Checklist

### Test Each Feature In:
- [ ] Chrome (latest)
- [ ] Firefox (latest) 
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Feature Compatibility Matrix:

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Background rotation | ☐ | ☐ | ☐ | ☐ | ☐ |
| Video carousel | ☐ | ☐ | ☐ | ☐ | ☐ |
| Amount editor | ☐ | ☐ | ☐ | ☐ | ☐ |
| URL generation | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## Bug Report Template

**Bug ID:** ________________

**Title:** ________________________________

**Browser/Device:** ________________________________

**Steps to Reproduce:**
1. ________________________________
2. ________________________________
3. ________________________________

**Expected Result:** ________________________________

**Actual Result:** ________________________________

**Severity:** ☐ Critical ☐ High ☐ Medium ☐ Low

**Screenshot/Video:** ________________________________

**Additional Notes:** ________________________________

---

**Testing Completed By:** ________________

**Date:** ________________

**Overall Test Status:** ☐ All Pass ☐ Pass with Minor Issues ☐ Major Issues Found