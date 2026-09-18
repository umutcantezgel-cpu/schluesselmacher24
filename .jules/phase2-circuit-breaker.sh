#!/bin/bash
EPOCH=$(cat .jules/state.json | jq -r '.epoch')
echo "CIRCUIT BREAKER TRIGGERED: Aborting cycle due to persistent regression."
git reset --hard checkpoint-epoch-${EPOCH}-start
git clean -fd
echo "Failed hypothesis logged." >> .jules/failed-hypotheses.log
