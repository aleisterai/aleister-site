# Context Efficiency Scoring (CES) System

## Purpose
Measure and optimize token usage efficiency. Track ratio of useful output to total context tokens.

## Scoring Formula
```
Efficiency Score = (useful_output_tokens / total_context_tokens) × 100
```

### Thresholds
- **Green (≥70%)**: Excellent efficiency
- **Yellow (40-69%)**: Acceptable, review for optimization
- **Red (<40%)**: Bloated context, immediate optimization needed

## What Counts as "Useful Output"
- Successful tool results
- Meaningful responses to user
- Completed task outputs
- Error messages that lead to fixes

## What Counts as "Bloat"
- Repeated file reads
- Verbose memory dumps
- Unused tool outputs
- Cached content re-reads
- Overly verbose prompts

## Tracking Implementation

### Session Start
```json
{
  "session_id": "agent:main:main",
  "start_time": "2026-02-25T20:30:00Z",
  "initial_tokens": 5000,
  "context_files_loaded": ["SOUL.md", "USER.md", "MEMORY.md"]
}
```

### Per-Action Tracking
```json
{
  "timestamp": "2026-02-25T20:35:00Z",
  "action_type": "tool_call",
  "tool": "read",
  "input_tokens": 200,
  "output_tokens": 1500,
  "result_used": true,
  "efficiency_contribution": "high"
}
```

### Session End Report
```json
{
  "session_id": "agent:main:main",
  "duration_minutes": 45,
  "total_input_tokens": 45000,
  "total_output_tokens": 8000,
  "useful_output_tokens": 6000,
  "efficiency_score": 13.3,
  "bloat_sources": [
    "Repeated file reads: SOUL.md (3x)",
    "Unused web_fetch results (2x)",
    "Verbose memory dumps"
  ],
  "recommendations": [
    "Cache SOUL.md in session, don't re-read",
    "Check if web results needed before fetching",
    "Use memory_search instead of full MEMORY.md reads"
  ]
}
```

## Weekly Review Process

Every Sunday at 11 PM:
1. Aggregate all session scores
2. Identify worst-performing sessions
3. Generate optimization playbook
4. Update AGENTS.md with new efficiency rules

## Efficiency Rules (Auto-Applied)

### Rule 1: File Read Deduplication
- Before reading a file, check if already loaded this session
- If yes, use cached content
- If modified, re-read only if necessary

### Rule 2: Memory vs Memory Search
- Use `memory_search` for specific queries
- Only load `MEMORY.md` on session start or when explicitly needed
- Never load full memory for simple lookups

### Rule 3: Tool Result Batching
- Batch related tool calls when possible
- Don't fetch web content unless definitely needed
- Cache web results for 1 hour

### Rule 4: Context Pruning Awareness
- Know current context window usage
- Proactively suggest compaction when >80%
- Prefer summaries over full dumps

## Bloat Detection Heuristics

1. **Repeated Patterns**: Same file read >2x in 10 minutes
2. **Large Unused Outputs**: Tool result >1000 tokens but not referenced
3. **Verbose Logging**: Debug info in production responses
4. **Over-fetching**: Web/API calls with unused fields
5. **Memory Churn**: Rapid add/remove of same context chunks

## Implementation in Code

### Pre-Flight Check (Before Tool Call)
```javascript
if (recentlyRead(file) && !fileModified(file)) {
  useCached(file);
  return;
}
```

### Post-Action Logging
```javascript
logAction({
  type: 'tool_call',
  tool: toolName,
  tokens: tokenCount,
  used: resultWasUsedInResponse,
  efficiency: calculateEfficiency()
});
```

### Session Summary Hook
```javascript
onSessionEnd(() => {
  generateEfficiencyReport();
  if (score < 40) {
    suggestOptimizations();
  }
});
```

## Success Metrics

- **Target**: 70%+ efficiency score for all sessions
- **Minimum**: 40% efficiency (never below)
- **Trend**: Week-over-week improvement
- **Cost Savings**: 30% reduction in token spend

## Integration with TIL

High-efficiency sessions → Extract patterns → Add to TIL
Low-efficiency sessions → Root cause analysis → Update AGENTS.md