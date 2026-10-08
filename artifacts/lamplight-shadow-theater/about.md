---
title: Lamplight Shadow Theater
summary: Make a hand shadow in front of your webcam, hold it still, and it peels off the paper screen as a fox, rabbit, dog, swan or bird with a name and a mood.
shelf: toys
tags: [hand-tracking, mediapipe, webcam, shadow-puppets, canvas-2d, web-audio]
made: 2026-10-08
status: published
featured: true
autorun: true
capture_wait: 2000
---

A paper shadow-puppet screen lit by a lamp behind it. Your hands, seen through the webcam, cast soft shadows on the paper. Hold one of five classic hand shapes still, a ring of light gathers around it, and the shadow steps off your hand onto the stage as a living cut-paper animal. Each one gets a name and a temperament, wanders the bank and the pond, and reacts to your hands and to the others. Without a camera, the mouse plays the hand.

## How to use it

- Press **Light the lamp** and allow the camera, or choose **No camera? Play with the mouse**.
- Make a shape from the **Hand Shapes** card and hold it still until the light closes in:
  - **Rabbit**: two fingers up for ears, thumb holding the rest down.
  - **Fox**: thumb touching the middle fingers, pointer and pinky as ears.
  - **Dog**: hand on its side, thumb up for an ear. Drop your pinky to bark.
  - **Swan**: fingertips together for a beak, your arm as the neck.
  - **Bird**: two hands hooked at the thumbs with the fingers spread. Two people can share it.
- In mouse mode, click a shape on the card, then hold the mouse still on the stage. Press and hold to pinch. **Escape** relaxes the hand.
- Then play with them. **Poke** gently to say hello. **Pinch** thumb and pointer to hold a crumb, then let go to drop it. A quick **swoosh** frightens the shy ones. Hold very **still** and a bird may land on you.
- **Sound** toggles the synthesized sounds, **Peek at camera** shows the mirrored webcam feed in a corner, and **Curtain call** brings the cast out to bow. **Tonight's Cast** lists everyone on stage with their name and mood.

## How it works

Hand tracking uses MediaPipe's Hand Landmarker, loaded from a public CDN and run inside the tab, so no video leaves the computer. It reports 21 landmarks per hand. The recognizer reads joint angles and finger ratios from the 3D world landmarks so the result does not depend on how the hand is turned, and uses the 2D image points only for orientation checks such as the dog's sideways pose. Tracks are matched frame to frame by wrist distance and smoothed. A shape has to be held still for a moment before it counts, and it must be released before it can make another creature.

The screen is drawn in layers. A procedural washi-paper texture (mottled pulp, long fibers, one glued seam) is lit by a warm falloff from the lamp. Hands and creatures are drawn as solid silhouettes into a shadow mask, blurred by how far they sit from the paper, and multiplied over the lit sheet. A newborn creature starts soft and close to the hand and sharpens as it lands on the stage. Eye holes and collars are cut out so light shows through, the way it does with real paper puppets.

Each animal is a set of keyframed poses blended by weight, with a trotting or hopping gait, breathing, blinking and tail motion layered on top. Behaviour is a small state machine (idle, walk, sniff, beg, eat, perch, flee, sleep, swim) steered by a temperament drawn at birth: bravery, energy, curiosity, friendliness and appetite. Two creatures can meet and chase, play, or wait for a shy one to warm up. All sounds are synthesized with the Web Audio API; there are no audio files.

A small kinematic hand model produces the same 21 landmarks MediaPipe would. It draws the illustrations on the Hand Shapes card, drives the mouse hand, and lets the recognizer be tested without a camera.

## Notes

The hand-tracking model downloads once from `cdn.jsdelivr.net` and `storage.googleapis.com`. Camera access needs a secure page (https or localhost), which the shelf provides.
