# image2-remotion-skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a first release architecture for image2-remotion-skill with strict AI-facing contracts and deterministic multi-image motion output.

**Architecture:** TypeScript-first request pipeline (`validate -> normalize -> selectPreset`) feeds a preset registry and Remotion composition runtime. Three presets implement real frame-driven spatial motion; five remain explicit placeholders with full motionSpec contracts.

**Tech Stack:** Remotion, React, TypeScript, Vitest.

---

- [x] Create project scaffold and config
- [x] Implement skill schema/default/validation/normalization/selectPreset
- [x] Implement preset contract and registry
- [x] Implement orbit-ring-intro, gallery-corridor, helix-tunnel
- [x] Implement placeholder presets for remaining v1 entries
- [x] Implement composition root and rendering pipeline
- [x] Add examples, docs, SKILL.md, acceptance checklist
- [x] Add and run tests
