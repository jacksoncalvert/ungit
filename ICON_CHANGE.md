# History Tab Icon Update

## Change Summary
Replaced the generic graph node icon with a proper **git-commit** octicon for the "History" tab in the repository view.

## Changes Made

### `/components/repository/repository.js`
- **Added `historyIcon` property**: Created a new property that generates the git-commit SVG icon
- **Code**: `this.historyIcon = octicons['git-commit'].toSVG({ height: 18 });`

### `/components/repository/repository.html`
- **Updated History tab button**: Replaced the CSS-based `<span class="graph-node-icon"></span>` with a data-bound icon
- **New markup**: `<span data-bind="html: historyIcon"></span>`

## Visual Impact

### Before
- Used a generic CSS class `graph-node-icon` that displayed a simple circular node
- Less intuitive representation of the commit history

### After
- Uses the octicons `git-commit` icon (shows a commit dot with connection lines)
- More semantically appropriate for a git history/commit log view
- Consistent with other git-related icons in the interface

## Icon Choice
The `git-commit` octicon was chosen because:
- It visually represents git commits/history
- It's part of the octicons git family (git-branch, git-merge, etc.)
- It's already used in the codebase for git operations
- Size (18px height) matches other tab icons

## Build Status
✅ Build successful  
✅ Server running on http://localhost:8448  
✅ Icon properly bundled and rendering

## Other Available Git Icons
If you want to try a different icon, here are other git-related octicons available:
- `git-branch` - Shows branching structure
- `git-merge` - Shows merge visualization
- `git-compare` - Shows comparison/diff view
- Simply change `octicons['git-commit']` to any of these in repository.js
