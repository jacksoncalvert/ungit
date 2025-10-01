# Feature Changes Summary

## 1. Tab Notification for Unstaged Changes

### Overview
The browser tab title now displays a count of unstaged files to help users quickly see when there are changes that need attention.

### Changes Made

#### `/public/source/main.js`
- **Modified `WindowTitle` constructor**: Added `unstagedCount` property initialized to 0
- **Modified `WindowTitle.prototype.update`**: Enhanced to prepend `(count)` to the title when there are unstaged files
- **Exposed `windowTitle` globally**: Made the `windowTitle` instance available globally via `ungit.windowTitle` for access from bundled components

#### `/components/staging/staging.js`
- **Added `nUnstagedFiles` computed observable**: Tracks files with `editState() === 'none'` and automatically updates the window title via `ungit.windowTitle` whenever the count changes

### How It Works
1. When files are loaded or their staged state changes, the `nUnstagedFiles` computed observable recalculates
2. The computed observable updates `windowTitle.unstagedCount` with the current count
3. The window title is refreshed to show: `(3) repository-name` when there are 3 unstaged files
4. When all files are staged or committed, the count badge is removed from the title

### User Experience
- Users can quickly see at a glance how many changes need staging without switching to the Ungit tab
- The notification appears as `(5) myrepo < folder` format in the browser tab
- The count updates in real-time as files are staged/unstaged

---

## 2. Auto-Commit on Squash Operations

### Overview
Squash operations now automatically create a commit instead of leaving changes in the staging area, streamlining the workflow.

### Changes Made

#### `/source/git-api.js`
- **Modified `/squash` endpoint**: Enhanced to automatically commit squashed changes after the merge
- **Added auto-commit logic**: After successful `git merge --squash`, immediately runs `git commit` with a descriptive message
- **Default commit message**: Uses format `Squash merge of {target}` or accepts custom message from request

#### `/components/graph/git-graph-actions.js`
- **Modified `Squash.perform()` method**: Now passes a descriptive commit message to the squash endpoint
- **Commit message format**: 
  - Branched lineage: `Squash merge from {source-sha} into {target-sha}`
  - Backward lineage: `Squash merge from {source-sha} into {target-sha}`
- **Uses short SHA**: Shows first 8 characters of commit SHA for readability

### How It Works
1. User initiates a squash operation via the graph UI
2. The squash action constructs a descriptive commit message with relevant SHA information
3. The `/squash` API endpoint performs `git merge --squash`
4. If squash succeeds, automatically runs `git commit` with the provided message
5. Events are emitted to update the git directory and working tree state

### User Experience
- **Before**: Squash would leave changes staged, requiring manual commit
- **After**: Squash completes in one action, immediately creating the commit
- **Commit messages**: Automatically generated with clear descriptions of what was squashed
- **Workflow improvement**: Reduces steps from squash → stage → commit → message to just squash

### Example Commit Messages
- `Squash merge from a1b2c3d4 into e5f6g7h8` (branched lineage)
- `Squash merge from 12345678 into abcdef12` (backward lineage)

---

## Testing Recommendations

### Tab Notification
1. Open a repository with uncommitted changes
2. Verify tab shows count: `(3) repo-name`
3. Stage one file, verify count decreases: `(2) repo-name`
4. Stage all files, verify badge disappears: `repo-name`
5. Unstage files, verify count reappears

### Auto-Commit on Squash
1. Create a branch with multiple commits
2. Perform a squash operation from the graph UI
3. Verify changes are automatically committed (not just staged)
4. Check commit message follows the format described above
5. Verify git log shows the new squash commit

---

## Backward Compatibility

Both features are **backward compatible** and don't break existing functionality:
- The tab notification is purely additive and doesn't affect existing behavior
- The auto-commit on squash completes the workflow that users previously had to finish manually
- No configuration changes or user intervention required
