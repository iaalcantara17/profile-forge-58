# Bugfix Batch 5

## Bug 1: Interview Prep -> Start Mock Interview leads to a broken blank page

### Status: INVESTIGATING

### Repro Steps:
1. Navigate to Interview Prep
2. Click "Start Mock Interview"
3. Fill in target role and settings
4. Click "Start Interview"
5. Observe blank page or error

### Root Cause:
INVESTIGATING - Initial assessment:
- Tables exist: mock_interview_sessions, mock_interview_responses, question_bank_items
- RLS policies are in place for all tables
- ErrorBoundary is already implemented
- Need to check if question_bank_items has data

### Fix Summary:
TBD

### Files Changed:
TBD

### Tests Added:
TBD

### Manual Verification:
TBD

---

## Bug 2: Collaboration -> Go to teams -> Create team leads to error: security policy for table "teams"

### Status: INVESTIGATING

### Repro Steps:
1. Navigate to Collaboration (Teams)
2. Click "Create Team"
3. Fill in team name and description
4. Click "Create Team"
5. Observe error: "Failed to create team: new row violates row-level security policy for table teams"

### Root Cause:
INVESTIGATING - Initial assessment:
- Teams INSERT policy: `with_check:(auth.uid() = created_by)`
- CreateTeamDialog was updated in bugfix-batch4 to use getSession() instead of getUser()
- Need to verify auth flow and ensure session is properly established

### Fix Summary:
TBD

### Files Changed:
TBD

### Tests Added:
TBD

### Manual Verification:
TBD
