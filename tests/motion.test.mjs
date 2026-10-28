import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createQualityMonitor,projectPose,spring} from '../assets/src/motion/model.js';
test('spring settles without divergence after a long frame',()=>{let state={x:0,velocity:0};state=spring(state,4,10);assert(Number.isFinite(state.x));for(let i=0;i<300;i++)state=spring(state,4,1/60);assert(Math.abs(state.x-4)<.001);assert(Math.abs(state.velocity)<.001);});
test('quality requires sustained slow frames and does not oscillate',()=>{const monitor=createQualityMonitor({samples:3});assert.equal(monitor.sample(30),false);assert.equal(monitor.sample(16),false);assert.equal(monitor.sample(30),false);assert.equal(monitor.sample(30),false);assert.equal(monitor.sample(30),true);monitor.reset();assert.equal(monitor.sample(16),true);});
test('project cut is bounded, reversible and handles empty/single filters',()=>{assert.deepEqual(projectPose(0,0),{index:0,next:0,cut:0});assert.deepEqual(projectPose(1,1),{index:0,next:0,cut:0});assert.deepEqual(projectPose(1,6),{index:5,next:5,cut:0});assert.deepEqual(projectPose(.3,6),{index:1,next:2,cut:.5});assert.deepEqual(projectPose(-1,6),projectPose(0,6));});
