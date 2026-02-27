# Subagent Performance Feedback (SPF) System

## Purpose
Track and optimize subagent effectiveness by model, task type, and cost.

## Metrics Tracked

### Per Subagent Spawn
```json
{
  "run_id": "abc123",
  "subagent_name": "Referral-DB-Schema",
  "model": "deepseek/deepseek-reasoner",
  "task_type": "database_schema",
  "start_time": "2026-02-25T20:00:00Z",
  "end_time": "2026-02-25T20:15:00Z",
  "duration_minutes": 15,
  "input_tokens": 5000,
  "output_tokens": 8000,
  "cost_usd": 0.25,
  "success": true,
  "output_quality": "high",
  "files_created": ["migration.sql"],
  "lines_of_code": 150,
  "user_satisfaction": 5
}
```

### Performance Score Calculation
```
Score = (success ? 100 : 0) × 0.3 +
        (1 / cost_usd) × 20 × 0.25 +
        (1 / duration_minutes) × 10 × 0.20 +
        (output_quality_score / 5) × 100 × 0.15 +
        (user_satisfaction / 5) × 100 × 0.10
```

### Model Effectiveness Matrix

| Model | Task Type | Avg Score | Avg Time | Avg Cost | Success Rate |
|-------|-----------|-----------|----------|----------|--------------|
| claude-opus-4-6 | Complex code | 95 | 5m | $0.50 | 98% |
| kimi-coding/k2p5 | Research | 80 | 3m | $0.10 | 90% |
| deepseek-reasoner | DB schema | 90 | 4m | $0.05 | 95% |
| gemini-2.5-flash | Simple tasks | 75 | 2m | $0.00 | 85% |

## Optimization Rules

### Rule 1: Model Selection by Task
```
IF task_type == "complex_code" THEN use "claude-opus-4-6"
IF task_type == "research" THEN use "kimi-coding/k2p5"
IF task_type == "database" THEN use "deepseek-reasoner"
IF task_type == "simple" THEN use "gemini-2.5-flash"
```

### Rule 2: Fallback Strategy
- If primary model fails 2x, switch to next best
- If cost > $1.00, switch to cheaper model
- If time > 30min, kill and respawn with clearer task

### Rule 3: Task Size Optimization
- If subagent times out, split task into smaller chunks
- If output is low quality, add more examples to prompt
- If cost is high, use cheaper model for first draft, expensive for refinement

## Weekly Performance Report

Generated every Sunday:
```
SPF Weekly Report (2026-W08)
=============================

Top Performers:
1. deepseek-reasoner (DB tasks) - Score: 92, Cost: $0.05
2. claude-opus-4-6 (Code) - Score: 95, Cost: $0.50
3. kimi-coding/k2p5 (Research) - Score: 80, Cost: $0.10

Underperformers:
1. gemini-2.5-flash (Complex tasks) - Score: 45
   Recommendation: Use only for simple tasks

Cost Optimization Opportunities:
- Switch 30% of kimi tasks to deepseek: Save $15/week
- Use gemini-flash for heartbeats: Already implemented ✅

Model Recommendations Update:
- Add "gemini-2.5-pro" to rotation for vision tasks
- Consider "grok-3-mini" for quick queries
```

## Implementation

### Tracking Hook (in subagent spawn)
```javascript
const spf = new SubagentPerformanceTracker();

const subagent = await spawnSubagent({
  task: description,
  model: selectedModel
});

spf.startTracking(subagent.runId, {
  name: subagent.label,
  model: selectedModel,
  taskType: classifyTask(description)
});

// On completion
subagent.onComplete((result) => {
  spf.endTracking(subagent.runId, {
    success: result.success,
    outputQuality: assessQuality(result),
    filesCreated: result.files?.length || 0
  });
});
```

### Automated Model Selection
```javascript
function selectOptimalModel(taskDescription, taskType) {
  const perf = spf.getPerformanceMatrix();
  
  // Get top performer for this task type
  const candidates = perf
    .filter(p => p.taskType === taskType)
    .sort((a, b) => b.avgScore - a.avgScore);
  
  if (candidates.length === 0) {
    // No data, use defaults
    return getDefaultModel(taskType);
  }
  
  // Return best performer under $0.50
  return candidates.find(c => c.avgCost < 0.50)?.model || candidates[0].model;
}
```

## Success Metrics

- **Prediction Accuracy**: 80%+ correct model selection
- **Cost Savings**: 25% reduction in subagent spend
- **Quality Improvement**: 15% increase in output quality scores
- **Time Reduction**: 20% faster task completion