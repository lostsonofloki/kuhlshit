# Kuhlshit.com Website - README

## Project Overview
This is the welcome page for Kuhlshit.com, a website featuring local content including podcasts, music, and community discussions.

## Features
1. **Porch Talk** - Engaging conversations and community discussions
2. **Closed on Sundays** - Podcast/Youtube featuring musicians playing 3-4 song sets
3. **Al's Spirits and Music** - Experience the finest spirits paired with great music selections

## Design Theme
The website features a modern dark theme with the following characteristics:
- Dark gradient background (#1a1a2e to #16213e)
- Dark card backgrounds (#1e1e2e) with light text for readability
- Blue accent colors for headings (#4cc9f0)
- Responsive design that works on both desktop and mobile devices

## Recent Changes Made

### Content Updates
- Added "Welcome You" heading at the top of the page
- Updated feature names and descriptions:
  - "Porch Talk" with description about community discussions
  - "Closed on Sundays" with description about the podcast featuring musicians
  - "Al's Spirits and Music" with description about spirits and music
- Replaced "Get Started" button with "Coming Soon" button
- Added image support for the "Porch Talk" feature (porchtalk.jpg)
- Added image support for the "Closed on Sundays" feature (closedonsundays.jpg)
- Created a dedicated page for the "Porch Talk" podcast with Spotify embed
- Made the "Porch Talk" feature clickable, linking to the dedicated podcast page
- Added placeholder for future episode listing functionality with technical notes on Spotify API integration
- Added placeholder for YouTube video integration with technical notes on YouTube Data API implementation
- Added instructions on how to find the YouTube channel ID for @porchtalk_101

### Design Updates
- Implemented a complete dark theme across the entire website
- Changed body background to dark gradient (#1a1a2e to #16213e)
- Updated container background to dark color (#0f0f1e)
- Modified header to use darker gradient (#0f3460 to #1a1a2e) with white text
- Updated feature cards to have dark background (#1e1e2e) with light text
- Changed text colors to lighter shades (#e0e0e0, #c0c0c0) for better readability
- Adjusted footer to match the dark theme (#0a0a16 background)
- Added brightness filter to images in feature cards for better integration with dark theme
- Ensured all color combinations provide good contrast for readability

### Technical Details
- HTML file: index.html
- CSS file: resources/index.css
- Image file: resources/porchtalk.jpg (for the Porch Talk feature)
- Responsive design using CSS Flexbox and media queries
- Modern CSS features including gradients, shadows, and transitions

## File Structure
```
Kuhl Shit/
├── index.html          # Main HTML file
├── resources/
│   ├── index.css       # Stylesheet
│   └── porchtalk.jpg   # Feature image
└── README.md           # This file
```

## How to View
Open the index.html file in any modern web browser to view the welcome page.

## Future Enhancements
- Add more interactive elements
- Implement additional pages for each feature
- Add video/audio player for the podcast content
- Include social media integration